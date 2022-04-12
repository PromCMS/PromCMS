<?php

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule();

$isSqlite = $_ENV['DB_CONNECTION'] === 'sqlite';

if ($isSqlite) {
  $dbFilePath = __DIR__ . '/../../' . $_ENV['DB_DATABASE'];
  if (!file_exists($dbFilePath)) {
    echo '⚠️ Seems like you are trying to use sqlite but the db file is not present, creating it...';

    mkdir(dirname($dbFilePath));

    $file = fopen($dbFilePath, 'w');

    echo fwrite($file, '');

    fclose($file);
  }
}

$capsule->addConnection([
  'driver' => $_ENV['DB_CONNECTION'],
  'host' => $_ENV['DB_HOST'],
  'database' => $isSqlite
    ? __DIR__ . '/../../' . $_ENV['DB_DATABASE']
    : $_ENV['DB_DATABASE'],
  'username' => $_ENV['DB_USERNAME'],
  'password' => $_ENV['DB_PASSWORD'],
  'charset' => 'utf8',
  'collation' => 'utf8_unicode_ci',
  'prefix' => '',
]);

$capsule->setAsGlobal();

$capsule->bootEloquent();

if ($isSqlite) {
  $capsule
    ->connection()
    ->getPdo()
    ->sqliteCreateFunction('REGEXP', function ($pattern, $value) {
      mb_regex_encoding('UTF-8');
      return preg_match("/$pattern/m", $value);
    });
}
