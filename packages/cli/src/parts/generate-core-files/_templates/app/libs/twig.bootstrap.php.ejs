<?php

use DI\Container;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

return function (Container $container) {
  $config = $container->get('config');
  $appRoot = $config['app']['root'];
  $isDevelopment = $config['env']['development'];
  $isDebug = $config['env']['debug'];

  $templatesPath = $appRoot . '/templates';
  $cachePath = $appRoot . '/cache/twig';

  if (!file_exists($templatesPath)) {
    if (!mkdir($templatesPath, 0777)) {
      throw new \Exception('Failed to create templates directory');
    }
  }

  $twigLoader = new FilesystemLoader($templatesPath);
  $twig = new Environment(
    $twigLoader,
    !$isDebug && !$isDevelopment
      ? [
        'cache' => $cachePath,
      ]
      : [],
  );

  $container->set('twig', $twig);
};
