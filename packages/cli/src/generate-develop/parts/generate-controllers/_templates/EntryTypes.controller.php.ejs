<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class EntryTypes
{
    private $container;
    private $loadedModelNames;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->loadedModelNames = $container->get('sysinfo')["loadedModels"];
    }

    public function getInfo(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {   
        $collectedModelSummaries = [];

        foreach ($this->loadedModelNames as $modelName) {
            $modelClass = new $modelName();
            $collectedModelSummaries[lcfirst($modelName)] = $modelClass->getSummary();
        }

        $response->getBody()->write(json_encode(
            $collectedModelSummaries
        ));

        return $response;
    }
}