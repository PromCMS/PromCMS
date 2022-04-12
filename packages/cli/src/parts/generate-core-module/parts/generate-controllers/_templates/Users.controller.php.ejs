<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Users
{
  private $container;
  private $loadedModels;

  public function __construct(Container $container)
  {
    $this->container = $container;
    $this->passwordService = $container->get('password-service');
    $this->loadedModels = $container->get('sysinfo')['loadedModels'];
  }

  public function getInfo(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $classInstance = new \Users();

    $response->getBody()->write(
      json_encode([
        'data' => $classInstance->getSummary(),
      ])
    );

    return $response;
  }

  public function getManyEntries(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $queryParams = $request->getQueryParams();
    $page = isset($queryParams['page']) ? $queryParams['page'] : 0;

    $dataPaginated = json_decode(
      \Users::paginate(15, ['*'], 'page', $page)->toJson()
    );
    // Unset some things as they are not useful or active
    unset($dataPaginated->links);
    unset($dataPaginated->first_page_url);
    unset($dataPaginated->last_page_url);
    unset($dataPaginated->next_page_url);
    unset($dataPaginated->prev_page_url);
    unset($dataPaginated->path);

    $response->getBody()->write(json_encode($dataPaginated));

    return $response;
  }

  public function updateEntry(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();

    if (isset($parsedBody['data']['password'])) {
      unset($parsedBody['data']['password']);
    }

    $response->getBody()->write(
      json_encode([
        'data' => \Users::where('id', $args['itemId'])->update(
          $parsedBody['data']
        ),
      ])
    );

    return $response;
  }

  public function getEntry(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    try {
      $response->getBody()->write(
        json_encode([
          'data' => \Users::where('id', $args['itemId'])
            ->get()
            ->firstOrFail(),
        ])
      );

      return $response;
    } catch (\Exception $e) {
      return $response->withStatus(404);
    }
  }

  public function createEntry(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();

    if (isset($parsedBody['data']['password'])) {
      $parsedBody['data']['password'] = $this->passwordService->generate(
        $parsedBody['data']['password']
      );
    }

    $response->getBody()->write(
      json_encode([
        'data' => \Users::create($parsedBody['data']),
      ])
    );

    return $response;
  }

  public function deleteEntry(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $response->getBody()->write(
      json_encode([
        'data' => \Users::where('id', $args['itemId'])->delete(),
      ])
    );

    return $response;
  }
}
