<?php

namespace App\Controllers;

use App\Exceptions\EntityDuplicateException;
use App\Exceptions\EntityNotFoundException;
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

    $pageLimit = 15;
    $query = $classInstance
      ->orderBy(
        $classInstance->getSummary()->hasOrdering
          ? ['order' => 'asc', 'id' => 'asc']
          : ['id' => 'asc'],
      )
      ->limit($pageLimit)
      ->skip($pageLimit * ($page - 1));
    $total = count($classInstance->getMany());
    $data = $query->getMany();
    $responseData = [
      'data' => $data,
      'current_page' => $page,
      'last_page' => floor($total / $pageLimit),
      'per_page' => $pageLimit,
      'total' => $total,
    ];

    if ($page === 1) {
      $responseData['data'] = array_merge(
        [
          [
            'id' => 0,
            'label' => 'Admin',
            'slug' => 'admin',
            'description' => 'Main user role provided by PROM CMS Core module',
          ],
        ],
        $responseData['data'],
      );
    }

    $response->getBody()->write(json_encode($responseData));

    return $response;
  }

  public function update(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();
    $classInstance = new \UserRoles();

    try {
      $item = $classInstance->getOneById($args['itemId']);
      $item->update($parsedBody['data']);

      prepareJsonResponse($response, $item->getData());

      return $response;
    } catch (\Exception $ex) {
      if ($ex instanceof EntityDuplicateException) {
        handleDuplicateEntriesError($response, $ex);

        return $response
          ->withStatus(400)
          ->withHeader('Content-Description', $ex->getMessage());
      } elseif ($ex instanceof EntityNotFoundException) {
        return $response
          ->withStatus(404)
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
    $classInstance = new \UserRoles();

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
        $classInstance
          ->where(['id', '=', intval($itemId)])
          ->getOne()
          ->getData(),
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
    $classInstance = new \UserRoles();

    try {
      prepareJsonResponse(
        $response,
        $classInstance->create($parsedBody['data'])->getData(),
      );

      return $response;
    } catch (\Exception $ex) {
      if ($ex instanceof EntityDuplicateException) {
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
    $classInstance = new \UserRoles();

    prepareJsonResponse(
      $response,
      $classInstance
        ->where(['id', '=', intval($args['itemId'])])
        ->delete()
        ->getData(),
    );

    return $response;
  }
}
