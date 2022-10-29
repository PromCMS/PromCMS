<?php

use PromCMS\Core\Services\EntryTypeService;
use PromCMS\Core\App;
use PromCMS\Core\Utils;

$PHP_APP_ROOT = $argv[1];
$PATH_TO_DATA_FILE = $argv[2];
include_once $PHP_APP_ROOT . '/vendor/autoload.php';
include_once $PHP_APP_ROOT . '/modules/Core/Services/EntryType.service.php';

$app = new App($PHP_APP_ROOT);
$app->init(true);
$container = $app->getSlimApp()->getContainer();
$moduleNames = Utils::getValidModuleNames($PHP_APP_ROOT);
$utils = $container->get(Utils::class);
$availableModels = [];

try {
  $dataFromJson = (array) json_decode(file_get_contents($PATH_TO_DATA_FILE));

  if (!$dataFromJson) {
    throw new Exception('Data file not available');
  }

  $groupedData = [];
  foreach (array_filter($dataFromJson, function ($item) {
    return $item->type === 'table';
  })
    as $item) {
    $groupedData[$item->name] = $item->data;
  }

  $availableModels = $container->get('sysinfo')['loadedModels'];

  foreach ($availableModels as $modelName) {
    echo "🔧 Founded model by the name of: '$modelName', trying to find data...";
    $modelInstance = new $modelName();
    $modelSummary = $modelInstance->getSummary();
    $tableName = $modelInstance->getTableName();

    if (!isset($groupedData[$tableName]) || !count($groupedData[$tableName])) {
      echo "▶️ Did not find data for $tableName, skipping...";
      continue;
    }

    $dataToImport = $groupedData[$tableName];
    $dataCount = count($dataToImport);

    $service = new EntryTypeService($modelInstance);

    echo "✅ Did find some data for $tableName, importing $dataCount item(s)...";

    // Delete items first, if any
    //$modelInstance->getStore()->deleteBy([]);

    foreach ($dataToImport as $data) {
      unset($data->id);
      // Insert all items in one query
      $service->create(json_decode(json_encode($data), true));
    }

    echo "✅ Successfully imported $dataCount item(s) for $tableName, continuing...";
  }

  exit(0);
} catch (Exception $e) {
  $message = $e->getMessage();
  $trace = $e->getTraceAsString();
  echo "⛔️ An error happened: $message \n $trace";
  exit(1);
}
