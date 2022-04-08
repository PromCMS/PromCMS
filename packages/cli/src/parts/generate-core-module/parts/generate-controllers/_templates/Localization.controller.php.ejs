<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use League\Flysystem\FilesystemException;

class Localization
{
  private $fs;

  public function __construct(Container $container)
  {
    $this->container = $container;
    $this->fs = $container->get('locales-filesystem');
  }

  /**
   * Gets localization for defined language
   */
  function getLocalization(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $lang = $args['lang'];
    $locales = [];

    try {
      $localeJson = $this->fs->read("/$lang.json");
      $locales = json_decode($localeJson);
    } catch (FilesystemException $exception) {
      // Do nothing
    }

    $response->getBody()->write(
      json_encode($locales),
    );

    return $response;
  }
}
