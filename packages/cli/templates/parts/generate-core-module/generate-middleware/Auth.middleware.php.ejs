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
    if (!$userId) {
      $response = new Response();

      prepareJsonResponse(
        $response,
        [],
        'User is not logged in',
        'not-logged-in',
      );

      return $response
        ->withStatus(401)
        ->withHeader('Content-Description', 'user logged off');
    } else {
      try {
        $this->container
          ->get('session')
          ->set('user', \Users::where(['id', '=', intval($userId)])->getOne());
      } catch (\Exception $e) {
        $response = new Response();
        // User does not exist hence the session destroy
        $this->container->get('session')::destroy();

        prepareJsonResponse(
          $response,
          [],
          'User is not logged in',
          'not-logged-in',
        );

        return $response
          ->withStatus(500)
          ->withHeader('Content-Description', 'logged in user does not exist');
      }
    }

    return $handler->handle($request);
  }
}
