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
include_once __DIR__ . '/libs/env.bootstrap.php';
include_once __DIR__ . '/utils.php';
include_once __DIR__ . '/libs/db.bootstrap.php';
include_once __DIR__ . '/libs/flysystem.bootstrap.php';
include_once __DIR__ . '/libs/mailer.bootstrap.php';
include_once __DIR__ . '/libs/twig.bootstrap.php';

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

    $container->set('utils-service', function ($c) use ($utils) {
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
        'name' => 'prom_session',
        'autorefresh' => true,
        'lifetime' => '1 hour',
        'httponly' => !PROM_IS_DEV,
        'secure' => !PROM_IS_DEV,
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
      $bootstrapAfter = "$moduleRoot/bootstrap.after.php";
      $apiRoutesFilepath = "$moduleRoot/api.routes.php";
      $frontRoutesFilepath = "$moduleRoot/front.routes.php";

      // Load bootstrap for that module
      if (file_exists($bootstrapFilepath)) {
        include_once $bootstrapFilepath;
      }

      // Load models beforehand and save these models to array
      $loadedModuleModels = $utils->autoloadModels($moduleRoot);
      if ($loadedModuleModels) {
        $loadedModels = array_merge($loadedModels, $loadedModuleModels);
      }

      // Loads controllers beforehand
      $utils->autoloadControllers($moduleRoot);

      if (file_exists($bootstrapAfter)) {
        include_once $bootstrapAfter;
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

    // Set filesystem module and attach it to container
    $container->set('filesystem', function () {
      global $filesystem;
      return $filesystem;
    });

    // TODO: Do not create this much fs instance - we need to create one and think about different solution
    // Set locales filesystem module and attach it to container
    $container->set('locales-filesystem', function () {
      global $localesFilesystem;
      return $localesFilesystem;
    });

    // Set mailer module and attach it to container
    $container->set('email', function () {
      global $mailer;
      return $mailer;
    });

    // Set twig module and attach it to container
    $container->set('twig', function () {
      global $twig;
      return $twig;
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
          $responseHeaders = $response->getHeaders();

          return $response
            ->withHeader('Access-Control-Allow-Origin', PROM_IS_DEV ? '*' : '')
            ->withHeader(
              'Access-Control-Allow-Headers',
              'X-Requested-With, Content-Type, Accept, Origin, Authorization',
            )
            ->withHeader(
              'Access-Control-Allow-Methods',
              'GET, POST, DELETE, PATCH',
            )
            ->withHeader(
              'Content-Type',
              isset($responseHeaders['Content-Type'])
                ? $responseHeaders['Content-Type']
                : 'application/json',
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
