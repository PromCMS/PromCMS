<?php

namespace App\Controllers;

use App\Services\Localization as ServicesLocalization;
use DI\Container;
use League\Flysystem\Filesystem;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use League\Flysystem\FilesystemException;

class Localization
{
  private Filesystem $fs;
  private ServicesLocalization $localizationService;

  public function __construct(Container $container)
  {
    $this->container = $container;
    $this->fs = $container->get('locales-filesystem');
    $this->localizationService = $this->container->get('localization-service');
  }

  function addGeneralKey(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $body = $request->getParsedBody();
    if (!isset($body['data']['key'])) {
      return $response->withStatus(400);
    }

    $key = $body['data']['key'];

    $this->localizationService->updateTranslations('default', $key, $key);

    return $response;
  }

  function updateKeyTranslations(
    ServerRequestInterface $request,
    ResponseInterface $response,
    $args
  ): ResponseInterface {
    $queryParams = $request->getQueryParams();
    $body = $request->getParsedBody();
    if (
      !isset($queryParams['lang']) ||
      !$this->localizationService->ensureTranslation($queryParams['lang']) ||
      !isset($body['data']['value'])
    ) {
      return $response->withStatus(404);
    }
    $lang = $queryParams['lang'];

    $key = $args['key'];
    $value = $body['data']['value'];

    if (!$key || !$value) {
      return $response->withStatus(400);
    }

    $this->localizationService->updateTranslations($lang, $key, $value);

    return $response;
  }

  function delete(
    ServerRequestInterface $request,
    ResponseInterface $response,
    $args
  ): ResponseInterface {
    $key = $args['key'];

    if (!$key) {
      return $response->withStatus(400);
    }

    $this->localizationService->deleteTranslationKey($key);

    return $response;
  }

  public function getMany(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $queryParams = $request->getQueryParams();
    if (
      !isset($queryParams['lang']) ||
      !$this->localizationService->ensureTranslation($queryParams['lang'])
    ) {
      return $response->withStatus(404);
    }
    $lang = $queryParams['lang'];

    $translations = $this->localizationService->getTranslations($lang);

    if (!$translations) {
      return $response->withStatus(404);
    }

    prepareJsonResponse(
      $response,
      $this->localizationService->getTranslations($lang),
    );

    return $response;
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

    $response->getBody()->write(json_encode($locales));

    return $response;
  }
}
