<?php

use Slim\Factory\AppFactory;
use DI\Container;
use Slim\Middleware\Session;

include_once __DIR__ . '/../vendor/autoload.php';
include_once __DIR__ . '/autoload.php';

function bootstrap()
{
  static $app;

  if (!$app) {
    // Add dependency container
    $container = new Container();

    AppFactory::setContainer($container);

    // Create an app
    $app = AppFactory::create();

    $container->set('session', function () {
      return new \SlimSession\Helper();
    });

    // Add routing middleware
    $app->addRoutingMiddleware();

    // Add SLIM PHP body parsing middleware
    $app->addBodyParsingMiddleware();

    $libsToInject = [
      '/libs/config.bootstrap.php',
      '/libs/utils.bootstrap.php',
      '/libs/db.bootstrap.php',
      '/libs/fly-system.bootstrap.php',
      '/libs/mailer.bootstrap.php',
      '/libs/twig.bootstrap.php',
    ];

    // Inject core php modules dynamically
    foreach ($libsToInject as $libPath) {
      $lib = require __DIR__ . $libPath;
      $lib($container);
    }

    $config = $container->get('config');
    $isDevelopment = $config['env']['development'];

    // SLIM PHP error middleware
    $app->addErrorMiddleware(
      $config['env']['debug'] || $isDevelopment,
      true,
      true,
    );

    // Session
    $app->add(
      new Session([
        'name' => 'prom_session',
        'autorefresh' => true,
        'lifetime' => '1 hour',
        'httponly' => !$isDevelopment,
        'secure' => !$isDevelopment,
      ]),
    );

    $modulesBootstrap = require_once __DIR__ . '/libs/modules.bootstrap.php';

    $modulesBootstrap($app, $container);
  }

  return $app;
}

$app = bootstrap()->run();
