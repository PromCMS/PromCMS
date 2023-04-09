<?php

use PromCMS\Core\Models\Users;
use PromCMS\Core\App;
use PromCMS\Core\Services\PasswordService;

include_once __DIR__ . '/../_utils.php';
$arguments = formatCliArguments($argv);
$appRoot = $arguments["cwd"];

include_once $appRoot . '/vendor/autoload.php';

$app = new App($appRoot);
$userId = $arguments["id"];
$newPassword = $arguments["password"];
$app->init(true);
$passwordService = new PasswordService();

try {
  Users::getOneById($userId)->update([
    'password' => $passwordService->generate($newPassword),
  ]);

  echo "User with id '$userId' has been updated!";

  exit(0);
} catch (\Exception $ex) {

  $message = $ex->getMessage();
  $trace = $ex->getTraceAsString();
  echo "⛔️ An error happened: $message \n $trace";

  exit(1);
}
