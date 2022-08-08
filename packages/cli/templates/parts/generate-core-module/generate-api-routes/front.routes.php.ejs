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
    $adminPath = __DIR__ . '/../../public/admin';
    $pieces = explode('/', $args['routePiece']);

    $content = fopen($adminPath . '/404/index.html', 'r');

    if (count($pieces) === 1) {
      if (file_exists($adminPath . '/' . $pieces[0] . '/index.html')) {
        $content = file_get_contents(
          $adminPath . '/' . $pieces[0] . '/index.html',
        );
      }
    } elseif (count($pieces) > 1) {
      if (
        //TODO - some logic which will search folder and match catch routes
        file_exists($adminPath . '/' . $pieces[0] . '/index.html')
      ) {
        $content = file_get_contents(
          $adminPath . '/' . $pieces[0] . '/index.html',
        );
      } elseif (file_exists($adminPath . '/index.html')) {
        $content = file_get_contents($adminPath . '/index.html');
      }
    }

    $response->getBody()->write($content);

    return $response;
  });
};
