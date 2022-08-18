<?php
use App\Services\Password as PasswordService;
use PromCMS\Core\App;
use PromCMS\Core\Config;
use PromCMS\Core\Path;
use PromCMS\Core\Utils;

$PHP_APP_ROOT = $argv[1];
include_once $PHP_APP_ROOT . '/vendor/autoload.php';
include_once $PHP_APP_ROOT . '/modules/Core/Services/Password.service.php';

$app = new App($PHP_APP_ROOT);
$app->init(true);
$container = $app->getSlimApp()->getContainer();

/** @var Utils */
$utils = $container->get(Utils::class);
$moduleNames = Utils::getValidModuleNames($PHP_APP_ROOT);
$availableModels = [];
$faker = Faker\Factory::create();
$passwordService = new PasswordService();

function str_includes(string $toSearch, string $text)
{
  return strpos($toSearch, $text) !== false;
}

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
  foreach ($moduleNames as $moduleName) {
    $moduleRoot = Utils::getModuleRoot($PHP_APP_ROOT, $moduleName);
    $modelsFolderName = $container->get(Config::class)->system->modules
      ->modelsFolderName;
    $modelsRoot = Path::join($moduleRoot, $modelsFolderName);

    if (is_dir($modelsRoot)) {
      $modelNames = $utils->autoloadModels($moduleRoot);
      $availableModels = array_merge($availableModels, $modelNames);
    }
  }

  foreach ($availableModels as $modelName) {
    echo "🔧 Founded model by the name of: '$modelName', trying to create table...";

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
        $inputValue;

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
            echo "❗Unsupported field type of value \"$fieldType\" supplied as a column type in mock generator";
            continue 2;
            break;
        }

        $creationPayload[$columnKey] = $inputValue;
      }

      // Try to create static admin user
      if ($modelName === 'Users' && $i === 0) {
        try {
          $creationPayload['email'] = 'test@example.com';
          $creationPayload['role'] = 0;
          $creationPayload['state'] = 'active';

          $modelInstance::create($creationPayload);
        } catch (\Exception $e) {
          // Static admin user has been created already, skipping
        }
      } else {
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
