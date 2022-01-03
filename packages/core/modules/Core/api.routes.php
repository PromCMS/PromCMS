<?php
/** @var \Slim\App $app */
/** @var Router $router */

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Routing\RouteCollectorProxy as Router;


$router->group('/system', function (Router $innerRouter) use ($app) {
});
