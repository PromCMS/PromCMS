<?php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

$container = $app->getContainer();
$promBase = PROM_URL_BASE ? PROM_URL_BASE : '/';

function adminRouting(
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
}

$router->get('/admin[/{routePiece:.*}]', 'adminRouting');
