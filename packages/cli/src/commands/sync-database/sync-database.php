<?php
use DI\Container;
use Illuminate\Database\Capsule\Manager as Capsule;
$PHP_APP_ROOT = $argv[1];
$LIBS_ROOT = $PHP_APP_ROOT . '/app/libs';
include_once $PHP_APP_ROOT . '/vendor/autoload.php';
include_once $PHP_APP_ROOT . '/app/utils.php';

$container = new Container();
$configBootstrap = require_once $LIBS_ROOT . '/config.bootstrap.php';
$utilsBootstrap = require_once $LIBS_ROOT . '/utils.bootstrap.php';
$dbBootstrap = require_once $LIBS_ROOT . '/db.bootstrap.php';
$configBootstrap($container);
$dbBootstrap($container);
$utilsBootstrap($container);
$utils = $container->get('utils');

/**
 * This files goes through all of models, creates db schemas from info about it and applies to db
 */
try {
  echo '👋 Hello! Welcome to schema syncing to your database!';
  echo '🔧 Trying to find some schemas in modules...';

  $moduleNames = BootstrapUtils::getValidModuleNames();

  foreach ($moduleNames as $moduleName) {
    $moduleRoot = BootstrapUtils::getModuleRoot($moduleName);
    $modelsFolderName = $container->get('config')['system']['modules'][
      'modelsFolderName'
    ];
    $modelsRoot = "$moduleRoot/$modelsFolderName";

    // if models folder exists in
    if (is_dir($modelsRoot)) {
      $modelNames = $utils->autoloadModels($moduleRoot);

      foreach ($modelNames as $modelName) {
        echo "🔧 Model has been found by the name of: '$modelName', trying to create table...";

        $modelInstance = new $modelName();

        $modelSummary = $modelInstance->getSummary();

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
              } elseif ($type === 'file' || $type === 'relationship') {
                $type = 'bigInteger';
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

            if (isset($column['default'])) {
              $value = $column['default'];
              $field->default($type === 'integer' ? intval($value) : $value);
            }
          }

          if ($modelSummary->hasTimestamps) {
            $table->timestamps();
          }

          if ($modelSummary->hasSoftDelete) {
            $table->softDeletes();
          }
        });
      }
    }
  }

  exit(0);
} catch (Exception $e) {
  $message = $e->getMessage();
  echo "⛔️ An error happened: $message";
  exit(1);
}
