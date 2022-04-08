<?php

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$templatesPath = $PROM_ROOT_FOLDER . '/templates';
$cachePath = $PROM_ROOT_FOLDER . '/cache';

if (!file_exists($templatesPath)) {
  if (!mkdir($templatesPath, 0777)) {
    throw new \Exception('Failed to create templates directory');
  }
}

$twigLoader = new FilesystemLoader($templatesPath);
$twig = new Environment(
  $twigLoader,
  !$PROM_DEVELOPMENT_MODE
    ? [
      'cache' => $cachePath,
    ]
    : [],
);
