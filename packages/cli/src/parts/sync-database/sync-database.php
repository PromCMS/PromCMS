<?php

use Illuminate\Database\Capsule\Manager as Capsule;

/**
 * This files goes through all of models, creates db schemas from info about it and applies to db
 */
try {
  $CORE_ROOT = __DIR__ . '/../../../../core/';

  include_once $CORE_ROOT . '/app/libs/env.bootstrap.php';
  include_once $CORE_ROOT . '/app/utils.php';
  include_once $CORE_ROOT . '/app/libs/db.bootstrap.php';

  echo '👋 Hello! Welcome to schema syncing to your database! ' . PHP_EOL;
  echo '🔧 Trying to find some schemas in modules...' . PHP_EOL;

  $moduleNames = BootstrapUtils::getValidModuleNames();
  $utils = new Utils();

  foreach ($moduleNames as $moduleName) {
    $moduleRoot = BootstrapUtils::getModuleRoot($moduleName);
    $modelsFolderName = $PROM_OPINIONATED_SETTINGS->modules['modelsFolderName'];
    $modelsRoot = "$moduleRoot/$modelsFolderName";

    // if models folder exists in
    if (is_dir($modelsRoot)) {
      $modelNames = $utils->autoloadModels($moduleRoot);

      foreach ($modelNames as $modelName) {
        echo "🔧 Founded model by the name of: '$modelName', trying to create table..." .
          PHP_EOL;

        $modelInstance = new $modelName();

        $modelSummary = $modelInstance->getSummary();
        try {
          // TODO: Should we delete already created database tables?
          Capsule::schema()->dropIfExists($modelSummary->tableName);

          Capsule::schema()->create($modelSummary->tableName, function (
            $table
          ) use ($modelSummary) {
            /** @var \Illuminate\Database\Schema\Blueprint $table */

            foreach ($modelSummary->columns as $columnKey => $column) {
              $type = $column['type'];
              $field = null;

              if ($columnKey === 'id' && $column['autoIncrement']) {
                $field = $table->bigIncrements('id');
              } else {
                if ($type === 'password' || $type === 'slug') {
                  $type = 'string';
                } elseif ($type === 'number') {
                  $type = 'integer';
                }

                switch ($type) {
                  case 'enum':
                    $field = $table->$type($columnKey, $column['enum']);
                    break;
                  case 'string':
                    $field = $table->$type($columnKey, 255);
                    break;
                  default:
                    $field = $table->$type($columnKey);
                    break;
                }
              }

              if ($column['unique']) {
                $field->unique();
              }

              if ($type === 'integer') {
                $field->integer()->default(0);
              }

              if (!$column['required']) {
                $field->nullable();
              }
            }

            if ($modelSummary->hasTimestamps) {
              $table->timestamps();
            }

            if ($modelSummary->hasSoftDelete) {
              $table->softDeletes();
            }
          });
        } catch (Exception $e) {
          $tableName = $modelSummary->tableName;
          $message = $e->getMessage();
          throw new Exception(
            "⛔️ An error happened during table '$tableName' creating: $message" .
              PHP_EOL,
          );
        }
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
