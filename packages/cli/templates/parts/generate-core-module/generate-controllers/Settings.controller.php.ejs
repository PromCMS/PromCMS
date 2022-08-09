<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Settings
{
  protected array $config;

  public function __construct(Container $container)
  {
    $this->config = $container->get('config');
  }

  public function get(
    ServerRequestInterface $request,
    ResponseInterface $response,
    $args
  ): ResponseInterface {
    prepareJsonResponse($response, [
      'i18n' => $this->config['i18n'],
      'app' => array_diff_key($this->config['app'], [
        'root' => null,
      ]),
    ]);

    return $response;
  }
}
