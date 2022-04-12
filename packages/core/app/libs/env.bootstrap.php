<?php

/**
 * DO NOT DELETE OR EDIT THIS FILE.
 * THIS FILE IS PART OF COCKPIT CMS.
 *
 */

use Dotenv\Dotenv;

// Autoload vendor libs if they are not included already
include_once __DIR__ . '/../../vendor/autoload.php';

$PROM_ROOT_FOLDER =
  __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..';
$PROM_UPLOADS_ROOT = $PROM_ROOT_FOLDER . DIRECTORY_SEPARATOR . 'uploads';
$PROM_LOCALES_ROOT = $PROM_ROOT_FOLDER . DIRECTORY_SEPARATOR . 'locales';

// load .env file if exists
$dotenv = Dotenv::createImmutable($PROM_ROOT_FOLDER);
$dotenv->load();
$dotenv->required(['APP_NAME', 'APP_URL', 'DB_CONNECTION', 'DB_DATABASE']);

$PROM_BASE = $_ENV['APP_PREFIX'];
$PROM_URL_BASE = strlen($PROM_BASE) ? "/{$PROM_BASE}" : $PROM_BASE;
$PROM_DEVELOPMENT_MODE = $_ENV['APP_ENV'] == 'development';
$DIRECTORY_SEPARATOR = DIRECTORY_SEPARATOR;
$PROM_OPINIONATED_SETTINGS = (object) [
  'modules' => [
    'modelsFolderName' => 'Models',
    'controllersFolderName' => 'Controllers',
  ],
];

/*
 * SYSTEM DEFINES
 */
if (!defined('PROM_ROOT_FOLDER')) {
  define('PROM_ROOT_FOLDER', $PROM_ROOT_FOLDER);
}
if (!defined('PROM_LOCALES_ROOT')) {
  define('PROM_LOCALES_ROOT', $PROM_LOCALES_ROOT);
}
if (!defined('PROM_UPLOADS_ROOT')) {
  define('PROM_UPLOADS_ROOT', $PROM_UPLOADS_ROOT);
}
if (!defined('PROM_APP_NAME')) {
  define('PROM_APP_NAME', $_ENV['APP_NAME']);
}
if (!defined('PROM_URL')) {
  define('PROM_URL', $_ENV['APP_URL']);
}
if (!defined('PROM_DEBUG_MODE')) {
  define('PROM_DEBUG_MODE', $_ENV['APP_DEBUG']);
}
if (!defined('PROM_IS_DEV')) {
  define('PROM_IS_DEV', $PROM_DEVELOPMENT_MODE);
}
if (!defined('PROM_URL_BASE')) {
  define('PROM_URL_BASE', $PROM_URL_BASE);
}
if (!defined('PROM_CORE_DIR')) {
  define(
    'PROM_CORE_DIR',
    $PROM_ROOT_FOLDER .
      DIRECTORY_SEPARATOR .
      implode(DIRECTORY_SEPARATOR, ['modules', 'Core']),
  );
}
if (!defined('PROM_IS_API_REQUEST')) {
  define(
    'PROM_IS_API_REQUEST',
    (isset($_SERVER['REQUEST_URI']) &&
      strpos($_SERVER['REQUEST_URI'], PROM_URL_BASE . '/api/')) !== false
      ? 1
      : 0,
  );
}
