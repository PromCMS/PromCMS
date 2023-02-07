<?php

use PromCMS\Core\Models\Users;
use PromCMS\Core\App;

include_once __DIR__ . '/../_utils.php';
$arguments = formatCliArguments($argv);
$appRoot = $arguments["cwd"];

include_once $appRoot . '/vendor/autoload.php';

$app = new App($appRoot);
$userId = $arguments["id"];
$app->init(true);

try {
  Users::getOneById($userId)->delete();

  echo "User with id '$userId' has been deleted!";

  exit(0);
} catch (\Exception $ex) {

  $message = $ex->getMessage();
  $trace = $ex->getTraceAsString();
  echo "⛔️ An error happened: $message \n $trace";

  exit(1);
}
