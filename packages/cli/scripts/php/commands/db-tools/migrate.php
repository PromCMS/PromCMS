<?php
use DI\Container;
$PHP_APP_ROOT = $argv[1];
$PATH_TO_DATA_FILE = $argv[1];
$LIBS_ROOT = $PHP_APP_ROOT . '/app/libs';
include_once $PHP_APP_ROOT . '/vendor/autoload.php';
include_once $PHP_APP_ROOT . '/app/autoload.php';

$container = new Container();
$configBootstrap = require_once $LIBS_ROOT . '/config.bootstrap.php';
$utilsBootstrap = require_once $LIBS_ROOT . '/utils.bootstrap.php';
$configBootstrap($container);
$utilsBootstrap($container);
$utils = $container->get('utils');

$moduleNames = BootstrapUtils::getValidModuleNames();
$utils = $container->get('utils');
$availableModels = [];

try {
  $dataFromJson = json_decode(readfile($PATH_TO_DATA_FILE));

  $groupedData = [];
  foreach (
    array_filter($dataFromJson, function ($item) {
      return $item['type'] === 'table';
    })
    as $item
  ) {
    $groupedData[$item['name']] = $item['data'];
  }

  // Load all models from modules
  foreach ($moduleNames as $moduleName) {
    $moduleRoot = BootstrapUtils::getModuleRoot($moduleName);
    $modelsFolderName = $container->get('config')['system']['modules'][
      'modelsFolderName'
    ];
    $modelsRoot = joinPath($moduleRoot, $modelsFolderName);

    if (is_dir($modelsRoot)) {
      $modelNames = $utils->autoloadModels($moduleRoot);
      $availableModels = array_merge($availableModels, $modelNames);
    }
  }

  foreach ($availableModels as $modelName) {
    echo "🔧 Founded model by the name of: '$modelName', trying to find data...";
    $modelSummary = $modelInstance->getSummary();
    $tableName = $modelInstance->getTableName();

    if (!isset($groupedData[$tableName]) || !count($groupedData[$tableName])) {
      echo "▶️ Did not find data for $tableName, skipping...";
      continue;
    }

    $dataToImport = $groupedData[$tableName];
    $dataCount = count($dataToImport);
    /**
     * @var SleekDB\Store
     */
    $modelStore = $modelInstance->getStore();

    echo "✅ Did find some data for $tableName, importing $dataCount item(s)...";

    // Delete items first, if any
    $modelStore->deleteBy([]);

    // Insert all items in one query
    $modelStore->insertMany($dataToImport);

    echo "✅ Successfully imported $dataCount item(s) for $tableName, continuing...";
  }

  exit(0);
} catch (Exception $e) {
  $message = $e->getMessage();
  $trace = $e->getTraceAsString();
  echo "⛔️ An error happened: $message \n $trace";
  exit(1);
}
