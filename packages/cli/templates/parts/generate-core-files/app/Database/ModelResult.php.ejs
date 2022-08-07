<?php

namespace App\Database;

class ModelResult
{
  private Model $modelClass;
  private array $data;

  function __construct(Model $modelClass, array $data)
  {
    $this->modelClass = $modelClass;
    $this->data = $data;

    return $data;
  }

  /**
   * Delete current item
   */
  public function delete()
  {
    return $this->modelClass->deleteById($this->data['id']);
  }

  /**
   * Update current item
   */
  public function update($args)
  {
    $result = $this->modelClass->updateById($this->data['id'], $args);

    $this->data = $result->getData();

    return $this;
  }

  /**
   * Return arrayed data
   */
  public function getData()
  {
    $hiddenFields = $this->modelClass::getHiddenFields();

    if (count($hiddenFields)) {
      return array_diff_key($this->data, array_flip($hiddenFields));
    }

    return $this->data;
  }

  /**
   * Convert data to json
   */
  public function toJson()
  {
    return json_encode($this->data);
  }

  /**
   * Return model className
   */
  public function getModelClassName()
  {
    return get_class($this->modelClass);
  }

  /**
   * Convert the model to its string representation.
   *
   * @return string
   */
  public function __toString()
  {
    return $this->toJson();
  }

  /**
   * Property style getter of data
   */
  public function __get($name)
  {
    if (array_key_exists($name, $this->data)) {
      return $this->data[$name];
    }

    $trace = debug_backtrace();
    trigger_error(
      'Undefined property via __get(): ' .
        $name .
        ' in ' .
        $trace[0]['file'] .
        ' on line ' .
        $trace[0]['line'],
      E_USER_NOTICE,
    );
    return null;
  }
}
