<?php

use PromCMS\Core\Models\Users;
use PromCMS\Core\App;
use PromCMS\Core\Services\PasswordService;

include_once __DIR__ . '/../_utils.php';
$arguments = formatCliArguments($argv);
$appRoot = $arguments["cwd"];

include_once $appRoot . '/vendor/autoload.php';

$app = new App($appRoot);
$userEmail = $arguments["email"];
$newPassword = $arguments["password"];
$app->init(true);
$passwordService = new PasswordService();

try {
  $users = new Users();

  $users->query()->where(["email", "=", $userEmail])->getOne()->update([
    'password' => $passwordService->generate($newPassword),
  ]);

  exit(0);
} catch (\Exception $ex) {

  $message = $ex->getMessage();
  $trace = $ex->getTraceAsString();
  echo "Error from PHP: $message \n $trace";

  exit(1);
}
