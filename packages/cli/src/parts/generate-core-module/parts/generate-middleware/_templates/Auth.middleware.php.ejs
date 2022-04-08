<?php

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use GuzzleHttp\Psr7\Response;

class Auth
{
  private $container;

  public function __construct($container)
  {
    $this->container = $container;
  }

  /**
   * Auth middleware class, it interacts with session and gets if in session theres a user_id or throws 401
   *
   * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 request
   * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 response
   * @param  callable                                 $next     Next middleware
   *
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function __invoke(Request $request, RequestHandler $handler): Response
  {
    $userId = $this->container->get('session')->get('user_id', false);
    $response = $handler->handle($request);

    if (!$userId) {
      $response = new Response();
      return $response
        ->withStatus(401)
        ->withHeader('Content-Description', 'user logged off');
    }

    return $response;
  }
}
