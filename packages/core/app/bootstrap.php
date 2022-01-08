<?php

/**
 * DO NOT DELETE OR EDIT THIS FILE.
 * THIS FILE IS PART OF COCKPIT CMS.
 *
 */

use Slim\Factory\AppFactory;
use DI\Container;
use Slim\Middleware\Session;

include_once __DIR__ . '/../vendor/autoload.php';
include_once __DIR__ . '/env.bootstrap.php';
include_once __DIR__ . '/utils.php';
include_once __DIR__ . '/db.bootstrap.php';

function bootstrap()
{
  static $app;
  $utils = new Utils();

  if (!$app) {
    // load config
    $config = array_replace_recursive(
      [
        'app.name' => 'PROM',
        'base_url' => PROM_URL_BASE,
        'base_route' => PROM_URL_BASE,
        'sec-key' => 'c3b40c4c-db44-s5h7-a814-b4931a15e5e1',
        'i18n' => 'en',

        'paths' => [
          '#root' => PROM_ROOT_FOLDER,
        ],
      ],
      [],
    );

    // Add dependency container
    $container = new Container();

    AppFactory::setContainer($container);

    // Create an app
    $app = AppFactory::create();

    $container->set('config', function ($c) use ($config) {
      return $config;
    });

    $container->set('utilsService', function ($c) use ($utils) {
      return $utils;
    });

    $container->set('session', function () {
      return new \SlimSession\Helper();
    });

    $app->addRoutingMiddleware();
    
    $app->addBodyParsingMiddleware();

    $app->addErrorMiddleware(PROM_DEBUG_MODE, true, true);

    // Session
    $app->add(
      new Session([
        'name' => 'dummy_session',
        'autorefresh' => true,
        'lifetime' => '1 hour',
      ]),
    );

    $filePathsToApiRoutes = [];
    $filePathsToFrontRoutes = [];

    // Make sure that 'Core' module is loaded first
    $moduleNames = BootstrapUtils::getValidModuleNames();

    // array of loaded model names (names of classes)
    $loadedModels = [];

    // Simple load module hack
    foreach ($moduleNames as $dirname) {
      $moduleRoot = BootstrapUtils::getModuleRoot($dirname);
      // Make sure that plugin has valid info file
      $bootstrapFilepath = "$moduleRoot/bootstrap.php";
      $apiRoutesFilepath = "$moduleRoot/api.routes.php";
      $frontRoutesFilepath = "$moduleRoot/front.routes.php";

      // Load models beforehand and save these models to array
      $loadedModuleModels = $utils->autoloadModels($moduleRoot);
      if ($loadedModuleModels) {
        $loadedModels = array_merge($loadedModels, $loadedModuleModels);
      }

      // Loads controllers beforehand
      $utils->autoloadControllers($moduleRoot);

      // Load bootstrap for that module
      if (file_exists($bootstrapFilepath)) {
        include_once $bootstrapFilepath;
      }

      // Add api routes definition file to set
      if (file_exists($apiRoutesFilepath)) {
        $filePathsToApiRoutes[] = $apiRoutesFilepath;
      }

      // Add front routes definition file to set
      if (file_exists($frontRoutesFilepath)) {
        $filePathsToFrontRoutes[] = $frontRoutesFilepath;
      }
    }

    // Set some info to memory so modules can access those
    $container->set('sysinfo', function () use ($loadedModels) {
      return [
        'loadedModels' => $loadedModels,
      ];
    });

    // Every module should have been bootstrapped by now so we can continue to including custom routes
    $app->group(PROM_URL_BASE ? '/' . PROM_URL_BASE : '', function (
      $router
    ) use ($filePathsToApiRoutes, $filePathsToFrontRoutes, $app) {
      // Load api routes first from prepared set
      $router
        ->group('/api', function ($router) use ($filePathsToApiRoutes, $app) {
          foreach ($filePathsToApiRoutes as $filePath) {
            include_once $filePath;
          }
        })
        ->add(function ($request, $handler) {
          $response = $handler->handle($request);
          return $response
            ->withHeader('Access-Control-Allow-Origin', PROM_IS_DEV ? '*' : '')
            ->withHeader(
              'Access-Control-Allow-Headers',
              'X-Requested-With, Content-Type, Accept, Origin, Authorization',
            )
            ->withHeader(
              'Access-Control-Allow-Methods',
              'GET, POST, DELETE, PATCH',
            );
        });

      // Load front routes second - same as api
      foreach ($filePathsToFrontRoutes as $filePath) {
        include_once $filePath;
      }
    });
  }

  return $app;
}

$app = bootstrap()->run();
