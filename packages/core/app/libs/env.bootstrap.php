<?php

/**
 * DO NOT DELETE OR EDIT THIS FILE.
 * THIS FILE IS PART OF COCKPIT CMS.
 *
 */

use Symfony\Component\Dotenv\Dotenv;

// Autoload vendor libs if they are not included already
include_once __DIR__ . '/../../vendor/autoload.php';

$PROM_ROOT_FOLDER =
  __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..';
$PROM_UPLOADS_ROOT = $PROM_ROOT_FOLDER . DIRECTORY_SEPARATOR . 'uploads';
$PROM_LOCALES_ROOT = $PROM_ROOT_FOLDER . DIRECTORY_SEPARATOR . 'locales';
$PROM_FILE_CACHE_ROOT =
  $PROM_ROOT_FOLDER .
  DIRECTORY_SEPARATOR .
  'cache' .
  DIRECTORY_SEPARATOR .
  'files';

// load .env file if exists
$dotenv = new Dotenv();
$dotenv->load($PROM_ROOT_FOLDER . '/.env');
// TODO: $dotenv->required(['APP_NAME', 'APP_URL', 'DB_CONNECTION', 'DB_DATABASE']);

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
if (!defined('PROM_FILE_CACHE_ROOT')) {
  define('PROM_FILE_CACHE_ROOT', $PROM_FILE_CACHE_ROOT);
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
if (!defined('PROM_SESSION_LIFETIME')) {
  define('PROM_SESSION_LIFETIME', $_ENV['SECURITY_SESSION_LIFETIME'] ?? 3600);
}
if (!defined('PROM_TOKEN_LIFETIME')) {
  define('PROM_TOKEN_LIFETIME', $_ENV['SECURITY_TOKEN_LIFETIME'] ?? 86400);
}
if (!defined('PROM_PERMISSIONS_ALLOW_EVERYTHING_KEY')) {
  define('PROM_PERMISSIONS_ALLOW_EVERYTHING_KEY', 'allow-everything');
}
if (!defined('PROM_PERMISSIONS_ALLOW_OWN_KEY')) {
  define('PROM_PERMISSIONS_ALLOW_OWN_KEY', 'allow-own');
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
