<?php

require __DIR__ . '/utils/utils.php';

use App\Twig\Extensions\AppExtension;
use Slim\App;

return function (App $app) {
  // get container
  /** @var \DI\Container $container */
  $container = $app->getContainer();
  $twig = $container->get('twig');

  autoloadFolder(__DIR__ . '/Services');
  autoloadFolder(__DIR__ . '/Http/Middleware');
  autoloadFolder(__DIR__ . '/rendering/TwigExtensions');

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
    return !$classInstance->getSummary()->isSharable
      ? ['created_by', '=', $ownerId]
      : [
        ['created_by', '=', $ownerId],
        'OR',
        ["coeditors.$ownerId", '=', true],
      ];
  }

  $container->set('password-service', new \App\Services\Password());
  $container->set('jwt-service', new \App\Services\JWT($container));
  $container->set('image-service', new \App\Services\ImageService($container));
  $container->set('file-service', new \App\Services\FileService($container));
  $container->set(
    'localization-service',
    new \App\Services\Localization($container),
  );

  // Add twig app extension
  $twig->addExtension(new AppExtension($container));
};
