<?php

use PromCMS\Core\Models\Users;
use PromCMS\Core\App;

include_once __DIR__ . '/../_utils.php';
$arguments = formatCliArguments($argv);
$appRoot = $arguments["cwd"];

include_once $appRoot . '/vendor/autoload.php';

$app = new App($appRoot);
$userEmail = $arguments["email"];
$app->init(true);

try {
  $users = new Users();
  $users->query()->where(["email", "=", $userEmail])->getOne()->delete();

  echo "User with id '$userEmail' has been deleted!";

  exit(0);
} catch (\Exception $ex) {

  $message = $ex->getMessage();
  $trace = $ex->getTraceAsString();
  echo "⛔️ An error happened: $message \n $trace";

  exit(1);
}
