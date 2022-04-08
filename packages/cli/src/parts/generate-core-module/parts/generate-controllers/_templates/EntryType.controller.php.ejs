<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class EntryType
{
    private $container;
    private $loadedModels;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->loadedModels = $container->get('sysinfo')["loadedModels"];
    }

    /**
     * Checks if model is loaded/exists and returns the real, usable model name
     */
    private function getModelFromArg (string $modelName) {
        $modelIndex = array_search(
            strtolower($modelName), 
            array_map(
                function ($modelName) { return strtolower($modelName); }, 
                $this->loadedModels
            )
        );
        if ($modelIndex === false) return false;

        $modelName = $this->loadedModels[$modelIndex];

        return "\\$modelName";
    }

    public function getInfo(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {
        $modelInstancePath = $this->getModelFromArg($args["modelId"]);
        if ($modelInstancePath === false) return $response->withStatus(404);

        $classInstance = new $modelInstancePath();

        $response->getBody()->write(json_encode(
            [
                "data" => $classInstance->getSummary()
            ]
        ));

        return $response;
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $modelInstancePath = $this->getModelFromArg($args["modelId"]);
        if ($modelInstancePath === false) return $response->withStatus(404);

        $parsedBody = $request->getParsedBody();

        $response->getBody()->write(json_encode(
            [
                "data" => $modelInstancePath::create($parsedBody["data"])
            ]
        ));

        return $response;
    }

    public function getManyEntries(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $modelInstancePath = $this->getModelFromArg($args["modelId"]);
        if ($modelInstancePath === false) return $response->withStatus(404);

        $queryParams = $request->getQueryParams();
        $page = isset($queryParams["page"]) ? $queryParams["page"] : 0;

        $dataPaginated = json_decode($modelInstancePath::paginate(15, ['*'], 'page', $page)->toJson());
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

    public function updateEntry(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $modelInstancePath = $this->getModelFromArg($args["modelId"]);
        if ($modelInstancePath === false) return $response->withStatus(404);

        $parsedBody = $request->getParsedBody();

        $response->getBody()->write(json_encode(
            [
                "data" => $modelInstancePath::where('id', $args['itemId'])->update($parsedBody["data"])
            ]
        ));

        return $response;
    }

    public function getEntry(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $modelInstancePath = $this->getModelFromArg($args["modelId"]);
        if ($modelInstancePath === false) return $response->withStatus(404);
        
        try {
            $response->getBody()->write(json_encode(
                [
                    "data" => $modelInstancePath::where('id', $args['itemId'])->get()->firstOrFail()
                ]
            ));
                    
                    return $response;
        } catch (\Exception $e) {
        return $response->withStatus(404);
        }
    }

    public function createEntry(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $modelInstancePath = $this->getModelFromArg($args["modelId"]);
        if ($modelInstancePath === false) return $response->withStatus(404);

        $parsedBody = $request->getParsedBody();

        $response->getBody()->write(json_encode(
            [
                "data" => $modelInstancePath::create($parsedBody["data"])
            ]
        ));

        return $response;
    }

    public function deleteEntry(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $modelInstancePath = $this->getModelFromArg($args["modelId"]);
        if ($modelInstancePath === false) return $response->withStatus(404);

        $response->getBody()->write(json_encode(
            [
                "data" => $modelInstancePath::where('id', $args['itemId'])->delete()
            ]
        ));

        return $response;
    }
}