<?php

use PromCMS\Core\Models\Users;
use PromCMS\Core\Services\PasswordService;
use PromCMS\Core\Exceptions\EntityDuplicateException;
use PromCMS\Core\App;

include_once __DIR__ . '/../_utils.php';
$arguments = formatCliArguments($argv);
$appRoot = $arguments["cwd"];

include_once $appRoot . '/vendor/autoload.php';

$app = new App($appRoot);
$app->init(true);
$container = $app->getSlimApp()->getContainer();
$passwordService = new PasswordService();


try {
  $user = Users::create(array_merge(
    [
      'email' => $arguments["email"],
      'password' => $passwordService->generate($arguments["password"]),
      'state' => 'active',
      'role' => 0
    ],
    isset($arguments["name"])
      ? ['name' => $arguments["name"]]
      : []
  ));

  $userEmail = $user->getData()["email"];

  echo "User with email '$userEmail' has been created!";

  exit(0);
} catch (\Exception $ex) {
  if ($ex instanceof EntityDuplicateException) {
    $message = $ex->getMessage();
    $trace = $ex->getTraceAsString();
    echo "⛔️ User with email '" . $arguments["email"] . "' already exists";
  } else {
    $message = $ex->getMessage();
    $trace = $ex->getTraceAsString();
    echo "⛔️ An error happened: $message \n $trace";
  }

  exit(1);
}
