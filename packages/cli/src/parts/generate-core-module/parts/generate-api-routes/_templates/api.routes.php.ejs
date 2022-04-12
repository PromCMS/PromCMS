<?php
/** @var Router $router */
use Slim\Routing\RouteCollectorProxy as Router;
use App\Middleware\Auth as AuthMiddleware;

$auth = new AuthMiddleware($app->getContainer());

$router->get('/locales/{lang}.json', '\App\Controllers\Localization:getLocalization');

$router->group('/profile', function (Router $innerRouter) use ($auth) {
  $innerRouter
    ->get('/me', '\App\Controllers\UserProfile:getCurrent')
    ->add($auth);

  $innerRouter
    ->post('/login', '\App\Controllers\UserProfile:login');

  $innerRouter
    ->post('/update', '\App\Controllers\UserProfile:update')
    ->add($auth);

  $innerRouter
    ->get('/request-password-reset', '\App\Controllers\UserProfile:requestPasswordReset');

  $innerRouter
    ->post('/finalize-password-reset', '\App\Controllers\UserProfile:finalizePasswordReset');

  $innerRouter
    ->get('/request-email-change', '\App\Controllers\UserProfile:requestEmailChange');

  $innerRouter
    ->post('/finalize-email-change', '\App\Controllers\UserProfile:finalizeEmailChange');

  $innerRouter
    ->get('/logout', '\App\Controllers\UserProfile:logout')
    ->add($auth);
});

$router->group('/entry-types', function (Router $innerRouter) use ($auth) {
  // get info about all of models
  $innerRouter->get('', 'App\Controllers\EntryTypes:getInfo')->add($auth);

  // Files
  $innerRouter->group('/files', function (Router $innerRouter) use ($auth) {
    $innerRouter
      ->get('/paged-items', '\App\Controllers\Files:getManyListed')
      ->add($auth);

    $innerRouter->group('/folders', function (Router $innerRouter) use ($auth) {
      $innerRouter->get('', '\App\Controllers\Folders:get')->add($auth);

      $innerRouter->post('', '\App\Controllers\Folders:create')->add($auth);

      $innerRouter->delete('', '\App\Controllers\Folders:delete')->add($auth);
    });

    $innerRouter->group('/items', function (Router $innerRouter) use ($auth) {
      $innerRouter->get('', '\App\Controllers\Files:getMany')->add($auth);
      $innerRouter
        ->post('/create', '\App\Controllers\Files:create')
        ->add($auth);

      $innerRouter->group('/{itemId}', function (Router $innerRouter) use (
        $auth
      ) {
        $innerRouter->get('', '\App\Controllers\Files:getFile');
        $innerRouter->get('/info', '\App\Controllers\Files:get')->add($auth);
        $innerRouter->patch('', '\App\Controllers\Files:update')->add($auth);
        $innerRouter->delete('', '\App\Controllers\Files:delete')->add($auth);
      });
    });
  });

  // custom user type group
  $innerRouter->group('/users', function (Router $innerRouter) use ($auth) {
    // get info only about one entry type
    $innerRouter->get('', '\App\Controllers\Users:getInfo')->add($auth);

    // entry type items group
    $innerRouter->group('/items', function (Router $innerRouter) use ($auth) {
      // get many entries for type
      $innerRouter->get('', '\App\Controllers\Users:getManyEntries');

      // create a entry-type entry
      $innerRouter
        ->post('/create', '\App\Controllers\Users:createEntry')
        ->add($auth);

      // entry-type entry group
      $innerRouter->group('/{itemId}', function (Router $innerRouter) use (
        $auth
      ) {
        $innerRouter->get('', '\App\Controllers\Users:getEntry');
        $innerRouter
          ->patch('', '\App\Controllers\Users:updateEntry')
          ->add($auth);
        $innerRouter
          ->delete('', '\App\Controllers\Users:deleteEntry')
          ->add($auth);
      });
    });
  });

  // entry type group
  $innerRouter->group('/{modelId}', function (Router $innerRouter) use ($auth) {
    // get info only about one entry type
    $innerRouter->get('', '\App\Controllers\EntryType:getInfo')->add($auth);

    // entry type items group
    $innerRouter->group('/items', function (Router $innerRouter) use ($auth) {
      // get many entries for type
      $innerRouter->get('', '\App\Controllers\EntryType:getManyEntries');

      // create a entry-type entry
      $innerRouter
        ->post('/create', '\App\Controllers\EntryType:createEntry')
        ->add($auth);

      // entry-type entry group
      $innerRouter->group('/{itemId}', function (Router $innerRouter) use (
        $auth
      ) {
        $innerRouter->get('', '\App\Controllers\EntryType:getEntry');
        $innerRouter
          ->patch('', '\App\Controllers\EntryType:updateEntry')
          ->add($auth);
        $innerRouter
          ->delete('', '\App\Controllers\EntryType:deleteEntry')
          ->add($auth);
      });
    });
  });
});