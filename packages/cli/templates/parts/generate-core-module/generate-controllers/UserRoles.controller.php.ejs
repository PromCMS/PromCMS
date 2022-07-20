<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UserRoles
{
  public function __construct(Container $container)
  {
    $this->passwordService = $container->get('password-service');
  }

  public function getInfo(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $instance = new \UserRoles();

    prepareJsonResponse($response, (array) $instance->getSummary());

    return $response;
  }

  public function getMany(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $queryParams = $request->getQueryParams();
    $page = intval(isset($queryParams['page']) ? $queryParams['page'] : 1);
    $classInstance = new \UserRoles();

    if ($classInstance->getSummary()->hasOrdering) {
      $query = \UserRoles::orderBy('order', 'ASC')->orderBy('id', 'ASC');
    } else {
      $query = \UserRoles::orderBy('id', 'ASC');
    }

    $dataPaginated = json_decode(
      $query
        ->paginate($queryParams['limit'] ?? 15, ['*'], 'page', $page)
        ->toJson(),
    );
    // Unset some things as they are not useful or active
    unset($dataPaginated->links);
    unset($dataPaginated->first_page_url);
    unset($dataPaginated->last_page_url);
    unset($dataPaginated->next_page_url);
    unset($dataPaginated->prev_page_url);
    unset($dataPaginated->path);

    if ($page === 1) {
      $dataPaginated->data = array_merge(
        [
          [
            'id' => 0,
            'label' => 'Admin',
            'slug' => 'admin',
            'description' => 'Main user role provided by PROM CMS Core module',
          ],
        ],
        $dataPaginated->data,
      );
    }

    $response->getBody()->write(json_encode($dataPaginated));

    return $response;
  }

  public function update(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();

    try {
      $item = \UserRoles::findOrFail($args['itemId']);
      $item->update($parsedBody['data']);

      prepareJsonResponse($response, $item->toArray());

      return $response;
    } catch (\Exception $ex) {
      if ($ex->getCode() === '23000') {
        handleDuplicateEntriesError($response, $ex);

        return $response
          ->withStatus(400)
          ->withHeader('Content-Description', $ex->getMessage());
      } else {
        return $response
          ->withStatus(500)
          ->withHeader('Content-Description', $ex->getMessage());
      }
    }
  }

  public function getOne(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $itemId = $args['itemId'];

    // For admin we return few static values
    if ($itemId === '0') {
      prepareJsonResponse($response, [
        'id' => 0,
        'label' => 'Admin',
        'slug' => 'admin',
      ]);

      return $response;
    }

    try {
      prepareJsonResponse(
        $response,
        \UserRoles::findOrFail($itemId)->toArray(),
      );

      return $response;
    } catch (\Exception $e) {
      return $response->withStatus(404);
    }
  }

  public function create(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();

    try {
      prepareJsonResponse(
        $response,
        \UserRoles::create($parsedBody['data'])->toArray(),
      );

      return $response;
    } catch (\Exception $ex) {
      if ($ex->getCode() === '23000') {
        handleDuplicateEntriesError($response, $ex);

        return $response
          ->withStatus(400)
          ->withHeader('Content-Description', $ex->getMessage());
      } else {
        return $response
          ->withStatus(500)
          ->withHeader('Content-Description', $ex->getMessage());
      }
    }
  }

  public function delete(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    prepareJsonResponse(
      $response,
      \UserRoles::where('id', $args['itemId'])
        ->delete()
        ->toArray(),
    );

    return $response;
  }
}
