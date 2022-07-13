<?php

/** @var \DI\Container $container */

use App\Twig\Extensions\AppExtension;

// get container
$container = $app->getContainer();

$utilsService = $container->get('utils-service');
$twig = $container->get('twig');

$utilsService->autoloadFolder(__DIR__ . '/Services');
$utilsService->autoloadFolder(__DIR__ . '/Http/Middleware');
$utilsService->autoloadFolder(__DIR__ . '/rendering/TwigExtensions');

class Path
{
  private static function hasSystemPathStarter(string $path)
  {
    return str_starts_with($path, DIRECTORY_SEPARATOR) ||
      str_starts_with($path, 'C:');
  }

  public static function join(...$args)
  {
    return (Path::hasSystemPathStarter($args[0]) ? '' : DIRECTORY_SEPARATOR) .
      implode(DIRECTORY_SEPARATOR, $args);
  }
}

/**
 * This generates mysql search params
 */
function onlyOwnersOrEditors(int $ownerId, $classInstance)
{
  return function ($query) use ($classInstance, $ownerId) {
    $where = $query->where('created_by', '=', $ownerId);

    if ($classInstance->getSummary()->isSharable) {
      $where->orWhere('coeditors', 'like', '%"' . $ownerId . '":true%');
    }
  };
}

$container->set('password-service', new \App\Services\Password());
$container->set('jwt-service', new \App\Services\JWT());
$container->set('image-service', new \App\Services\ImageService($container));
$container->set('file-service', new \App\Services\FileService($container));

// Add twig app extension
$twig->addExtension(new AppExtension($container));
