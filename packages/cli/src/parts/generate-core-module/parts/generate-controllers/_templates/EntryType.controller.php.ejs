<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Illuminate\Database\Capsule\Manager as DB;

class EntryType
{
  private $currentUser;

  public function __construct(Container $container)
  {
    $this->currentUser = $container->get('session')->get('user', false);
  }

  private function handleDuplicate($response, $exception)
  {
    handleDuplicateEntriesError($response, $exception);
  }

  public function getInfo(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $instance = $request->getAttribute('model-instance');

    prepareJsonResponse($response, $instance->getSummary());

    return $response;
  }

  public function swapTwo(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $instancePath = $request->getAttribute('model-instance-path');
    $classInstance = $request->getAttribute('model-instance');
    $instance = $request->getAttribute('model-instance');
    $parsedBody = $request->getParsedBody();
    $data = $parsedBody['data'];

    if (
      !$instance->getSummary()->hasOrdering ||
      !isset($data['fromId']) ||
      !isset($data['toId'])
    ) {
      return $response->withStatus(400);
    }

    try {
      $ownableQueryFilter = onlyOwnersOrEditors(
        $this->currentUser->id,
        $classInstance,
      );

      $fromEntryQuery = $instancePath::where('id', $data['fromId']);
      $toEntryQuery = $instancePath::where('id', $data['toId']);

      $fromEntryQuery->where($ownableQueryFilter);
      $toEntryQuery->where($ownableQueryFilter);

      $fromEntry = $fromEntryQuery->firstOrFail();
      $toEntry = $toEntryQuery->firstOrFail();

      DB::beginTransaction();

      $savedOrderId = $toEntry->order;
      $toEntry->order = $fromEntry->order;
      $fromEntry->order = $savedOrderId;

      if ($instance->getSummary()->ownable && $this->currentUser) {
        $fromEntry->updated_by = $this->currentUser->id;
        $toEntry->updated_by = $this->currentUser->id;
      }

      $fromEntry->save();
      $toEntry->save();

      DB::commit();

      prepareJsonResponse($response, [], '', 'success');
    } catch (\Exception $e) {
      DB::rollback();

      return $response
        ->withStatus(500)
        ->withHeader('Content-Description', $e->getMessage());
    }

    return $response;
  }

  public function getMany(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $modelInstancePath = $request->getAttribute('model-instance-path');
    $classInstance = $request->getAttribute('model-instance');
    $queryParams = $request->getQueryParams();
    $page = isset($queryParams['page']) ? $queryParams['page'] : 0;

    if ($classInstance->getSummary()->hasOrdering) {
      $query = $modelInstancePath
        ::orderBy('order', 'ASC')
        ->orderBy('id', 'ASC');
    } else {
      $query = $modelInstancePath::orderBy('id', 'ASC');
    }

    if ($request->getAttribute('permission-only-own', false) === true) {
      $query->where(
        onlyOwnersOrEditors($this->currentUser->id, $classInstance),
      );
    }

    $dataPaginated = json_decode(
      $query->paginate(15, ['*'], 'page', $page)->toJson(),
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

  public function update(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $modelInstancePath = $request->getAttribute('model-instance-path');
    $classInstance = $request->getAttribute('model-instance');
    $parsedBody = $request->getParsedBody();

    try {
      $query = $modelInstancePath::where('id', $args['itemId']);

      if ($request->getAttribute('permission-only-own', false) === true) {
        $query->where(
          onlyOwnersOrEditors($this->currentUser->id, $classInstance),
        );
      }

      $item = $query->firstOrFail();

      if ($classInstance->getSummary()->ownable && $this->currentUser) {
        $parsedBody['data']['updated_by'] = $this->currentUser->id;
      }

      $item->update($parsedBody['data']);

      prepareJsonResponse($response, $item->toArray());

      return $response;
    } catch (\Exception $ex) {
      if ($ex->getCode() === '23000') {
        $this->handleDuplicate($response, $ex);

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
    $modelInstancePath = $request->getAttribute('model-instance-path');
    $classInstance = $request->getAttribute('model-instance');

    try {
      $query = $modelInstancePath::where('id', $args['itemId']);

      if ($request->getAttribute('permission-only-own', false) === true) {
        $query->where(
          onlyOwnersOrEditors($this->currentUser->id, $classInstance),
        );
      }

      $item = $query->firstOrFail();

      prepareJsonResponse($response, $item->toArray());

      return $response;
    } catch (\Exception $error) {
      return $response
        ->withStatus(404)
        ->withHeader('Content-Description', $error->getMessage());
    }
  }

  public function create(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $modelInstancePath = $request->getAttribute('model-instance-path');
    $classInstance = $request->getAttribute('model-instance');
    $parsedBody = $request->getParsedBody();

    try {
      if ($classInstance->getSummary()->ownable && $this->currentUser) {
        $parsedBody['data']['created_by'] = $this->currentUser->id;
      }

      prepareJsonResponse(
        $response,
        $modelInstancePath::create($parsedBody['data'])->toArray(),
      );

      return $response;
    } catch (\Exception $ex) {
      if ($ex->getCode() === '23000') {
        $this->handleDuplicate($response, $ex);

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
    $modelInstancePath = $request->getAttribute('model-instance-path');
    $classInstance = $request->getAttribute('model-instance');

    $query = $modelInstancePath::where('id', $args['itemId']);

    if ($request->getAttribute('permission-only-own', false) === true) {
      $query->where(
        onlyOwnersOrEditors($this->currentUser->id, $classInstance),
      );
    }

    if (!$query->delete()) {
      prepareJsonResponse($response, [], 'Failed to delete');

      return $response
        ->withStatus(500)
        ->withHeader('Content-Description', 'Failed to delete');
    }

    prepareJsonResponse($response, [], 'Item deleted');

    return $response;
  }
}
