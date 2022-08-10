<?php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app, RouteCollectorProxy $router) {
  $router->get('/admin[/{routePiece:.*}]', function (
    ServerRequestInterface $request,
    ResponseInterface $response,
    $args
  ) {
    $adminPath = joinPath(__DIR__, '..', '..', 'public', 'admin');
    $content = file_get_contents($adminPath . '/index.html', 'r');
    $response->getBody()->write($content);

    return $response;
  });
};
