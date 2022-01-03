<?php

/** @var \Slim\Routing\RouteCollectorProxy $router */

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

$router->get('/server/info', function (ServerRequestInterface $request, ResponseInterface $response): ResponseInterface {
    $response->getBody()->write(phpinfo());

    return $response;
});
