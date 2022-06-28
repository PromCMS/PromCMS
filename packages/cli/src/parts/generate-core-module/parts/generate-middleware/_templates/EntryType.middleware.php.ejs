<?php
/**
 * DO NOT DELETE OR EDIT THIS FILE.
 * THIS FILE IS PART OF COCKPIT CMS
 * AND ANY MODIFICATION MAY BREAK OR BE
 * OVERRIDDEN IN NEXT UPDATE.
 *
 */

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use GuzzleHttp\Psr7\Response;
use Slim\Routing\RouteContext;

class EntryType
{
  private $loadedModels;

  public function __construct($container)
  {
    $this->loadedModels = $container->get('sysinfo')['loadedModels'];
  }

  /**
   * Checks if model is loaded/exists and returns the real, usable model name
   */
  private function getModelFromArg(string $modelName)
  {
    $modelIndex = array_search(
      strtolower($modelName),
      // filter out those files we wanted to opt out
      array_filter(
        // format all model names to be all in lowercase
        array_map(function ($modelName) {
          return strtolower($modelName);
        }, $this->loadedModels),
        function ($modelName) {
          return !in_array($modelName, ['files', 'users', 'userroles']);
        },
      ),
    );
    if ($modelIndex === false) {
      return false;
    }

    $modelName = $this->loadedModels[$modelIndex];

    return "\\$modelName";
  }

  /**
   * Permission middleware class, it interacts with session and gets if in session theres a sufficient user role for provided route
   *
   * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 request
   * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 response
   * @param  callable                                 $next     Next middleware
   *
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function __invoke(Request $request, RequestHandler $handler): Response
  {
    $routeContext = RouteContext::fromRequest($request);
    $route = $routeContext->getRoute();
    $modelInstancePath = $this->getModelFromArg($route->getArgument('modelId'));

    if ($modelInstancePath === false) {
      $response = new Response();

      return $response
        ->withStatus(404)
        ->withHeader('Content-Description', 'model does not exist');
    }

    // Attach on request to pass the model instance info
    $request = $request->withAttribute(
      'model-instance',
      new $modelInstancePath(),
    );
    $request = $request->withAttribute(
      'model-instance-path',
      $modelInstancePath,
    );

    return $handler->handle($request);
  }
}
