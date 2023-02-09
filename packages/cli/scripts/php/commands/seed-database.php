<?php

use PromCMS\Core\Services\PasswordService;
use PromCMS\Core\App;
use PromCMS\Core\Utils;

include_once __DIR__ . '/_utils.php';
$arguments = formatCliArguments($argv);
$appRoot = $arguments[0];

include_once $appRoot . '/vendor/autoload.php';

$app = new App($appRoot);
$app->init(true);
$container = $app->getSlimApp()->getContainer();

/** @var Utils */
$utils = $container->get(Utils::class);
$moduleNames = Utils::getValidModuleNames($appRoot);
$availableModels = [];
$faker = Faker\Factory::create();
$passwordService = new PasswordService();

function specialStringFaker($columnName)
{
  global $faker;
  $finalValue = '';

  if (str_includes($columnName, 'name')) {
    $finalValue = $faker->name();
  } elseif (str_includes($columnName, 'title')) {
    $finalValue = $faker->jobTitle();
  } elseif (str_includes($columnName, 'avatar')) {
    $finalValue = $faker->imageUrl();
  } elseif (str_includes($columnName, 'email')) {
    $finalValue = $faker->uuid() . strtolower($faker->email());
  } else {
    $finalValue = $faker->boolean() ? $faker->word() : $faker->sentence(3);
  }

  return $finalValue;
}

/**
 * This files goes through all of models, creates db schemas from info about it and applies to db
 */
try {
  $availableModels = $container->get('sysinfo')['loadedModels'];

  foreach ($availableModels as $modelName) {
    $splittedName = explode("\\", $modelName);
    $realModelName = end($splittedName);

    echo "🔧 Founded model by the name of: '$realModelName', trying to create table...";

    $modelInstance = new $modelName();
    $modelSummary = $modelInstance->getSummary();
    if ($modelSummary->ignoreSeeding) {
      continue;
    }

    for ($i = 0; $i < 10; $i++) {
      $creationPayload = [];

      foreach ((array) $modelSummary->columns as $columnKey => $column) {
        if ($columnKey === 'id') {
          continue;
        }

        [
          'required' => $fieldIsRequired,
          'editable' => $fieldIsEditable,
          'unique' => $fieldIsUnique,
          'type' => $fieldType,
        ] = $column;
        $inputValue = '';

        // Add more randomness, if field is not required then we may not fill it out
        if (!$fieldIsRequired) {
          $rndShouldInput = $faker->boolean();
          if (!$rndShouldInput) {
            continue;
          }
        }

        switch ($fieldType) {
          case 'boolean':
            $inputValue = $faker->boolean();
            break;
          case 'string':
            $inputValue = specialStringFaker($columnKey);
            break;
          case 'enum':
            $enumValues = $column['enum'];

            $inputValue = $enumValues[rand(0, count($enumValues) - 1)];
            break;
          case 'number':
            $inputValue = $faker->randomNumber(5, false);
            break;
          case 'date':
            $inputValue = $faker->date();
            break;
          case 'password':
            $inputValue = $passwordService->generate('test123');
            break;
          case 'slug':
            $inputValue = $faker->uuid();
            break;
          case 'json':
            // TODO: Needs implementation
            $inputValue = '';
            break;
          case 'relationship':
            // TODO: Needs implementation
            $inputValue = 0;
            break;
          case 'longText':
            $value = $faker->paragraphs(3);

            $inputValue = is_string($value) ? $value : implode(' ', $value);
            break;
          default:
            echo "🗿 Cannot generate field type \"$fieldType\" for column \"$columnKey\" since its not supported - skipping...";
            continue 2;
            break;
        }

        $creationPayload[$columnKey] = $inputValue;
      }

      // Try to create static admin user
      if ($realModelName === 'Users' && $i === 0) {
        try {
          $creationPayload['email'] = 'test@example.com';
          $creationPayload['role'] = 0;
          $creationPayload['state'] = 'active';

          $modelInstance::create($creationPayload);
        } catch (\Exception $e) {
          echo $e;
          // Static admin user has been created already, skipping
        }
      } else {
        if (!count($creationPayload)) {
          echo "🗿 Empty creation payload for \"$fieldType\" - skipping...";
          continue;
        }

        $modelInstance::create($creationPayload);
      }
    }
  }

  exit(0);
} catch (Exception $e) {
  $message = $e->getMessage();
  $trace = $e->getTraceAsString();
  echo "⛔️ An error happened: $message \n $trace";
  exit(1);
}
