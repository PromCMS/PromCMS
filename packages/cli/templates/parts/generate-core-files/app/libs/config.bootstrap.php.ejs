<?php

use DI\Container;
use Symfony\Component\Dotenv\Dotenv;
use SleekDB\Query;

$PROM_ROOT_FOLDER = joinPath(__DIR__, '..', '..');
$dotenv = new Dotenv();
$dotenv->load($PROM_ROOT_FOLDER . '/.env');

return function (Container $container) use ($PROM_ROOT_FOLDER) {
  $PROM_UPLOADS_ROOT = joinPath($PROM_ROOT_FOLDER, 'uploads');
  $PROM_LOCALES_ROOT = joinPath($PROM_ROOT_FOLDER, 'locales');
  $PROM_FILE_CACHE_ROOT = joinPath($PROM_ROOT_FOLDER, 'cache', 'files');

  $APP_PREFIX = $_ENV['APP_PREFIX'] ? '/' . $_ENV['APP_PREFIX'] : '';
  $APP_ENV = $_ENV['APP_ENV'] ?? 'development';
  $IS_DEV_ENV = $APP_ENV == 'development';
  $DEFAULT_LANGUAGE = $_ENV['LANGUAGE'] ?? 'en';
  $LANGUAGES = array_merge(
    [$DEFAULT_LANGUAGE],
    explode(',', $_ENV['MORE_LANG'] ?? ''),
  );

  $config = [
    'app' => [
      'name' => $_ENV['APP_NAME'] ?? 'PromCMS Project',
      'root' => $PROM_ROOT_FOLDER,
      'url' => $_ENV['APP_URL'],
      'prefix' => $APP_PREFIX,
      'baseUrl' => $_ENV['APP_PREFIX']
        ? $_ENV['APP_URL'] . $APP_PREFIX
        : $_ENV['APP_URL'],
    ],
    'security' => [
      'session' => [
        'lifetime' => $_ENV['SECURITY_SESSION_LIFETIME'] ?? 3600,
      ],
      'token' => [
        'lifetime' => $_ENV['SECURITY_TOKEN_LIFETIME'] ?? 86400,
      ],
    ],
    'db' => [
      'root' => joinPath($PROM_ROOT_FOLDER, '.database'),
      'storeConfig' => [
        'auto_cache' => !$IS_DEV_ENV,
        'cache_lifetime' => $IS_DEV_ENV ? null : 180, // Three minutes
        'timeout' => false,
        'primary_key' => 'id',
        'search' => [
          'min_length' => 2,
          'mode' => 'or',
          'score_key' => 'scoreKey',
          'algorithm' => Query::SEARCH_ALGORITHM['hits'],
        ],
      ],
    ],
    'env' => [
      'development' => $IS_DEV_ENV,
      'debug' => $_ENV['APP_DEBUG'],
      'env' => $APP_ENV,
    ],
    'fs' => [
      'cachePath' => $PROM_FILE_CACHE_ROOT,
      'localesPath' => $PROM_LOCALES_ROOT,
      'uploadsPath' => $PROM_UPLOADS_ROOT,
    ],
    'i18n' => [
      'default' => $DEFAULT_LANGUAGE,
      'languages' => $LANGUAGES,
    ],
    'system' => [
      'modules' => [
        'modelsFolderName' => 'Models',
        'controllersFolderName' => 'Controllers',
      ],
    ],
  ];

  $container->set('config', $config);
};
