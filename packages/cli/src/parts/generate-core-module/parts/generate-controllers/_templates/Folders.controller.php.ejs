<?php

namespace App\Controllers;

use DI\Container;
use League\Flysystem\DirectoryListing;
use League\Flysystem\FilesystemException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Folders
{
  private $fs;

  public function __construct(Container $container)
  {
    $this->fs = $container->get('filesystem');
  }

  private function listingHasContents(DirectoryListing $listing)
  {
    $hasItems = false;

    foreach ($listing as $item) {
      $hasItems = true;
      break;
    }

    return $hasItems;
  }

  public function get(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $params = $request->getQueryParams();

    try {
      $listing = $this->fs->listContents($params['path'], false);
      $folders = [];

      /** @var \League\Flysystem\StorageAttributes $item */
      foreach ($listing as $item) {
        $path = $item->path();

        if ($item instanceof \League\Flysystem\DirectoryAttributes) {
          $folders[] = basename($path);
        }
      }

      $response->getBody()->write(
        json_encode([
          'data' => $folders,
        ]),
      );

      return $response->withStatus(200);
    } catch (FilesystemException $exception) {
      return $response
        ->withStatus(500)
        ->withHeader('Content-Description', $exception->getMessage());
    }
  }

  public function create(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();
    $data = $parsedBody['data'];

    try {
      if (is_dir(PROM_UPLOADS_ROOT . $data['path'])) {
        return $response->withStatus(409);
      }

      $this->fs->createDirectory($data['path']);

      return $response->withStatus(200);
    } catch (FilesystemException $exception) {
      return $response
        ->withStatus(500)
        ->withHeader('Content-Description', $exception->getMessage());
    }
  }

  public function delete(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $data = $request->getQueryParams();
    $path = $data['path'];

    try {
      $hasItems = $this->listingHasContents(
        $this->fs->listContents($path, false),
      );

      if ($hasItems) {
        return $response->withStatus(400);
      }

      $this->fs->deleteDirectory($path);

      return $response->withStatus(200);
    } catch (FilesystemException $exception) {
      return $response
        ->withStatus(500)
        ->withHeader('Content-Description', $exception->getMessage());
    }
  }
}