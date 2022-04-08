<?php

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule();

$isSqlite = getenv('DB_CONNECTION') === 'sqlite';

if ($isSqlite) {
  $dbFilePath = __DIR__ . '/../../' . getenv('DB_DATABASE');
  if (!file_exists($dbFilePath)) {
    echo '⚠️ Seems like you are trying to use sqlite but the db file is not present, creating it...';

    mkdir(dirname($dbFilePath));

    $file = fopen($dbFilePath, 'w');

    echo fwrite($file, '');

    fclose($file);
  }
}

$capsule->addConnection([
  'driver' => getenv('DB_CONNECTION'),
  'host' => getenv('DB_HOST'),
  'database' => $isSqlite
    ? __DIR__ . '/../../' . getenv('DB_DATABASE')
    : getenv('DB_DATABASE'),
  'username' => getenv('DB_USERNAME'),
  'password' => getenv('DB_PASSWORD'),
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
