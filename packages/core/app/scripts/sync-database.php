<?php

use Illuminate\Database\Capsule\Manager as Capsule;

/**
 * This files goes through all of models, creates db schemas from info about it and applies to db
 */
try {
  include_once __DIR__ . '/../env.bootstrap.php';
  include_once __DIR__ . '/../utils.php';
  include_once __DIR__ . '/../db.bootstrap.php';

  if (getenv('DB_CONNECTION') == 'sqlite') {
    $dbFilePath = __DIR__ . '/../../' . getenv('DB_DATABASE');
    if (!file_exists($dbFilePath)) {
      echo '⚠️ Seems like you are trying to use sqlite but the db file is not present, creating it...';

      mkdir(dirname($dbFilePath));

      $file = fopen($dbFilePath, 'w');

      echo fwrite($file, '');

      fclose($file);
    }
  }

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

            if ($modelSummary->hasTimestamps) {
              $table->timestamps();
            }

            if ($modelSummary->hasSoftDelete) {
              $table->softDeletes();
            }

            foreach ($modelSummary->columns as $columnKey => $column) {
              $type = $column['type'];
              $field = null;

              if ($type === 'password') {
                $type = 'string';
              } elseif ($type === 'number') {
                $type = 'integer';
              }

              if ($type === 'enum') {
                $field = $table->$type($columnKey, $column['enum']);
              } else {
                $field = $table->$type($columnKey);
              }

              if ($column['unique']) {
                $field->unique();
              }

              if (!$column['required']) {
                $field->nullable();
              }
            }
          });
        } catch (Exception $e) {
          $tableName = $modelSummary->tableName;
          $message = $e->getMessage();
          throw new Exception("⛔️ An error happened during table '$tableName' creating: $message" .
            PHP_EOL);
        }
      }
    }
  }

  echo '✅ Done! Goodbye.' . PHP_EOL;
} catch (Exception $e) {
  $message = $e->getMessage();
  throw new Exception("⛔️ An error happened: $message" . PHP_EOL);
}
