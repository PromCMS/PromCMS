<?php

/**
 * DO NOT DELETE THIS FILE.
 * THIS FILE IS PART OF COCKPIT CMS.
 *
 */

use Dotenv\Dotenv;
use Slim\Factory\AppFactory;

// Autoload vendor libs
include(__DIR__ . '/vendor/autoload.php');

// load .env file if exists
Dotenv::load(__DIR__);

// check for custom defines
if (file_exists(__DIR__ . '/defines.php')) {
    include(__DIR__ . '/defines.php');
}

$PROM_BASE               = '';
$PROM_ROOT_FOLDER        = __DIR__ . strlen($PROM_BASE) ? "/$PROM_BASE" : "";
$PROM_URL_BASE           = strlen($PROM_BASE) ? "/{$PROM_BASE}" : $PROM_BASE;
$PROM_DEVELOPMENT_MODE   = $_ENV['ENVIRONMENT'] == 'dev';
$DIRECTORY_SEPARATOR     = DIRECTORY_SEPARATOR;

/*
 * SYSTEM DEFINES
 */
if (!defined('PROM_ROOT_FOLDER'))               define('PROM_ROOT_FOLDER', $PROM_BASE);
if (!defined('PROM_IS_DEV'))                    define('PROM_IS_DEV', $PROM_DEVELOPMENT_MODE);
if (!defined('PROM_URL_BASE'))                  define('PROM_URL_BASE', $PROM_URL_BASE);
if (!defined('PROM_CORE_DIR'))                  define('PROM_CORE_DIR', __DIR__ . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, ['modules', 'Core']));
if (!defined('PROM_IS_API_REQUEST'))            define('PROM_IS_API_REQUEST', strpos($_SERVER['REQUEST_URI'], PROM_URL_BASE . '/api/') !== false ? 1 : 0);

function getDirContents($dir, &$results = array())
{
    $files = scandir($dir);

    foreach ($files as $key => $value) {
        $path = realpath($dir . DIRECTORY_SEPARATOR . $value);
        if (!is_dir($path)) {
            $results[] = $path;
        } else if ($value != "." && $value != "..") {
            getDirContents($path, $results);
            $results[] = $path;
        }
    }

    return $results;
}

function bootstrap()
{
    global $PROM_ROOT_FOLDER;

    static $app;

    if (!$app) {

        // load config
        $config = array_replace_recursive([

            'app.name'     => 'PROM',
            'base_url'     => PROM_URL_BASE,
            'base_route'   => PROM_URL_BASE,
            'sec-key'      => 'c3b40c4c-db44-s5h7-a814-b4931a15e5e1',
            'i18n'         => 'en',

            'paths'         => [
                '#root'     => PROM_ROOT_FOLDER,
            ],

        ], []);

        $app = AppFactory::create();

        $app['config'] = $config;

        $app->utils->autoloadFolder = function (string $pathToFolder) {
            $filePaths = getDirContents($pathToFolder);
            foreach ($filePaths as $filePath) {
                include_once $filePath;
            }
        };

        $app->addRoutingMiddleware();

        $app->addErrorMiddleware(PROM_IS_DEV, true, true);

        $filePathsToApiRoutes = [];
        $filePathsToFrontRoutes = [];

        // Make sure that 'Core' module is loaded first
        $moduleNames = array_merge([
            'Core',
            // Filter out the 'Core' module from basic set
            array_filter(
                // Map that dirs to folder names
                array_map(
                    function ($dir) {
                        return basename($dir);
                    },
                    // Firstly get all the dirs from modules folder
                    glob("$PROM_ROOT_FOLDER/modules/*", GLOB_ONLYDIR)
                ),
                function ($dirname) {
                    return $dirname !== 'Core';
                }
            )
        ]);

        // Simple load module hack
        foreach ($moduleNames as $dirname) {
            $moduleRoot = "$PROM_ROOT_FOLDER/modules/$dirname";
            // Make sure that plugin has valid info file
            if (file_exists("$moduleRoot/module-info.json")) {
                $bootstrapFilepath   = "$moduleRoot/bootstrap.php";
                $apiRoutesFilepath   = "$moduleRoot/api.routes.php";
                $frontRoutesFilepath = "$moduleRoot/front.routes.php";

                // Load bootstrap for that module
                if (file_exists($bootstrapFilepath))    include_once $bootstrapFilepath;
                // Add api routes definition file to set
                if (file_exists($apiRoutesFilepath))    $filePathsToApiRoutes[] = $apiRoutesFilepath;
                // Add front routes definition file to set
                if (file_exists($frontRoutesFilepath))  $filePathsToFrontRoutes[] = $frontRoutesFilepath;
            } else {
                echo "Warning - Included module '$dirname' wont be functional if you dont provide module-info.json";
            }
        }

        // Every module should have been bootstrapped by now so we can continue to including custom routes
        $app->group('/' . PROM_URL_BASE, function () use ($filePathsToApiRoutes, $filePathsToFrontRoutes) {
            // Load api routes first from prepared set
            $this->group('/api', function () use ($filePathsToApiRoutes) {
                foreach ($filePathsToApiRoutes as $filePath) {
                    include_once $filePath;
                }
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
