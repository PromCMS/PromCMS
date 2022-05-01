<?php

use App\Services\Password as PasswordService;

$PHP_APP_ROOT = __DIR__ . '/../../../../core';

include_once $PHP_APP_ROOT . '/modules/Core/Services/Password.service.php';
include_once $PHP_APP_ROOT . '/vendor/autoload.php';
include_once $PHP_APP_ROOT . '/app/libs/env.bootstrap.php';
include_once $PHP_APP_ROOT . '/app/utils.php';
include_once $PHP_APP_ROOT . '/app/libs/db.bootstrap.php';

$moduleNames = BootstrapUtils::getValidModuleNames();
$utils = new Utils();
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
  foreach ($moduleNames as $moduleName) {
    $moduleRoot = BootstrapUtils::getModuleRoot($moduleName);
    $modelsFolderName = $PROM_OPINIONATED_SETTINGS->modules['modelsFolderName'];
    $modelsRoot = "$moduleRoot/$modelsFolderName";

    if (is_dir($modelsRoot)) {
      $modelNames = $utils->autoloadModels($moduleRoot);
      $availableModels = array_merge($availableModels, $modelNames);
    }
  }

  foreach ($availableModels as $modelName) {
    echo "🔧 Founded model by the name of: '$modelName', trying to create table..." .
      PHP_EOL;

    $modelInstance = new $modelName();
    $modelSummary = $modelInstance->getSummary();
    if ($modelSummary->ignoreSeeding) {
      continue;
    }

    for ($i = 0; $i < 10; $i++) {
      $creationPayload = [];

      foreach ((array) $modelSummary->columns as $columnKey => $column) {
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
          case 'longText':
            $value = $faker->paragraphs(3);

            $inputValue = is_string($value) ? $value : implode(' ', $value);
            break;
          default:
            echo "Unknown value \"$fieldType\" supplied as a column type in mock generator";
            continue 2;
            break;
        }

        $creationPayload[$columnKey] = $inputValue;
      }

      // Try to create static admin user
      if (strtolower($modelName) === 'users' && $i === 0) {
        try {
          $creationPayload['email'] = 'test@example.com';
          $creationPayload['role'] = 'admin';
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

  echo '✅ Done! Goodbye.' . PHP_EOL;
  exit(0);
} catch (Exception $e) {
  $message = $e->getMessage();
  echo "⛔️ An error happened: $message" . PHP_EOL;
  exit(1);
}
