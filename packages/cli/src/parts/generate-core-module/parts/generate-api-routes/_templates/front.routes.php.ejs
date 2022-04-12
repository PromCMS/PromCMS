<?php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

$container = $app->getContainer();
$promBase = PROM_URL_BASE ? PROM_URL_BASE : '/';

$router->get('/admin[/{routePiece:.*}]', function (
  ServerRequestInterface $request,
  ResponseInterface $response,
  $args
) use ($container, $promBase) {
  $adminPath = __DIR__ . '/../../public/admin';
  $pieces = explode('/', $args['routePiece']);

  $content = fopen($adminPath . '/404.html', 'r');

  if (count($pieces) === 1) {
    if (
      $newContent = file_get_contents($adminPath . '/' . $pieces[0] . '.html')
    ) {
      $content = $newContent;
    }
  } elseif (count($pieces) > 1) {
    if (
      //TODO - some logic which will search folder and match catch routes
      $newContent = file_get_contents(
        $adminPath . '/' . $pieces[0] . '/index.html'
      )
    ) {
      $content = $newContent;
    } elseif ($newContent = file_get_contents($adminPath . '/index.html')) {
      $content = $newContent;
    }
  }

  $response->getBody()->write($content);

  return $response;
});
