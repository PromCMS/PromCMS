<?php

namespace App\Services;

use App\Database\Model;
use App\Database\ModelResult;

class EntryTypeService
{
  protected Model $modelInstance;
  protected string $language;

  public function __construct(Model $modelInstance, $language = null)
  {
    $this->modelInstance = $modelInstance;
    if ($language) {
      $this->language = $language;
    }
  }

  /**
   * Create item
   */
  public function create(array $payload): ModelResult
  {
    return $this->modelInstance->create($payload);
  }

  /**
   * Get one
   */
  public function getOne($where): ModelResult
  {
    $query = $this->modelInstance->query();

    if (isset($this->language)) {
      $query->setLanguage($this->language);
    }

    return $query->where($where)->getOne();
  }

  /**
   * Get many items from current model
   */
  public function getMany(array $where = [], $page = 1, $pageLimit = 15): array
  {
    $query = $this->modelInstance->query();

    if (isset($this->language)) {
      $query->setLanguage($this->language);
    }

    $query
      ->orderBy(
        $this->modelInstance->getSummary()->hasOrdering
          ? ['order' => 'asc', 'id' => 'asc']
          : ['id' => 'asc'],
      )
      ->limit($pageLimit)
      ->skip($pageLimit * ($page - 1));

    $total = count($this->modelInstance->where($where)->getMany());
    $query->where($where);
    $data = $query->getMany();

    return [
      'data' => $data,
      'current_page' => $page,
      'last_page' => floor($total / $pageLimit),
      'per_page' => $pageLimit,
      'total' => $total,
      'from' => $pageLimit * $page + 1,
      'to' => $pageLimit * $page + $pageLimit,
    ];
  }

  /**
   * Update an item
   */
  public function update(array $where, array $payload): ModelResult
  {
    $query = $this->modelInstance->query();

    if (isset($this->language)) {
      $query->setLanguage($this->language);
    }

    return $query->where($where)->update($payload);
  }

  /**
   * Delete an item
   */
  public function delete(array $where): ModelResult
  {
    $item = $this->modelInstance->where($where)->delete();

    return $item;
  }
}
