<?php

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$isSqlite = getenv("DB_CONNECTION") === 'sqlite';

$capsule->addConnection([
  'driver'    => getenv("DB_CONNECTION"),
  'host'      => getenv("DB_HOST"),
  'database'  => $isSqlite ? __DIR__ . '/../' . getenv("DB_DATABASE") : getenv("DB_DATABASE"),
  'username'  => getenv("DB_USERNAME"),
  'password'  => getenv("DB_PASSWORD"),
  'charset'   => 'utf8',
  'collation' => 'utf8_unicode_ci',
  'prefix'    => '',
]);

$capsule->setAsGlobal();

$capsule->bootEloquent();
