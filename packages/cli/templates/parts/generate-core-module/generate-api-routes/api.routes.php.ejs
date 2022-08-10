<?php
use Slim\Routing\RouteCollectorProxy as Router;
use App\Middleware\Auth as AuthMiddleware;
use App\Middleware\EntryType as EntryTypeMiddleware;
use App\Middleware\Permission as PermissionMiddleware;
use Slim\App;

return function (App $app, Router $router) {
  $auth = new AuthMiddleware($app->getContainer());
  $entryTypeMiddleware = new EntryTypeMiddleware($app->getContainer());
  $permissionMiddleware = new PermissionMiddleware($app->getContainer());

  // Languages
  $router->get(
    '/locales/{lang}.json',
    '\App\Controllers\Localization:getLocalization',
  );

  $router->group('/settings', function (Router $innerRouter) {
    $innerRouter->get('', '\App\Controllers\Settings:get');
  });

  // Profile
  $router->group('/profile', function (Router $innerRouter) use ($auth) {
    $innerRouter->get(
      '/request-password-reset',
      '\App\Controllers\UserProfile:requestPasswordReset',
    );
    $innerRouter->get(
      '/request-email-change',
      '\App\Controllers\UserProfile:requestEmailChange',
    );
    $innerRouter->post(
      '/finalize-password-reset',
      '\App\Controllers\UserProfile:finalizePasswordReset',
    );
    $innerRouter->post(
      '/finalize-email-change',
      '\App\Controllers\UserProfile:finalizeEmailChange',
    );
    $innerRouter->post('/login', '\App\Controllers\UserProfile:login');

    $innerRouter
      ->group('', function (Router $innerRouter) {
        $innerRouter->get('/me', '\App\Controllers\UserProfile:getCurrent');
        $innerRouter->get('/logout', '\App\Controllers\UserProfile:logout');
        $innerRouter->post('/update', '\App\Controllers\UserProfile:update');
      })
      ->add($auth);
  });

  $router->group('/entry-types', function (Router $innerRouter) use (
    $auth,
    $permissionMiddleware,
    $entryTypeMiddleware
  ) {
    // get info about all of models
    $innerRouter->get('', 'App\Controllers\EntryTypes:getInfo')->add($auth);

    $innerRouter->group('/generalTranslations/items', function (
      Router $innerRouter
    ) use ($auth) {
      $innerRouter->get('', '\App\Controllers\Localization:getMany');
      $innerRouter
        ->post('/create', '\App\Controllers\Localization:addGeneralKey')
        ->add($auth);

      $innerRouter
        ->group('/{key}', function (Router $innerRouter) {
          $innerRouter->delete('', '\App\Controllers\Localization:delete');
          $innerRouter->patch(
            '',
            '\App\Controllers\Localization:updateKeyTranslations',
          );
        })
        ->add($auth);
    });

    // Folders
    $innerRouter
      ->group('/folders', function (Router $innerRouter) {
        $innerRouter->get('', '\App\Controllers\Folders:get');
        $innerRouter->post('', '\App\Controllers\Folders:create');
        $innerRouter->delete('', '\App\Controllers\Folders:delete');
      })
      ->add($auth);

    // Files
    $innerRouter
      ->group('/files', function (Router $innerRouter) {
        $innerRouter->get(
          '/paged-items',
          '\App\Controllers\Files:getManyListed',
        );

        $innerRouter->group('/items', function (Router $innerRouter) {
          $innerRouter->get('', '\App\Controllers\Files:getMany');
          $innerRouter->post('/create', '\App\Controllers\Files:create');

          $innerRouter->group('/{itemId}', function (Router $innerRouter) {
            $innerRouter->get('', '\App\Controllers\Files:get');
            $innerRouter->patch('', '\App\Controllers\Files:update');
            $innerRouter->delete('', '\App\Controllers\Files:delete');
          });
        });
      })
      ->add($permissionMiddleware)
      ->add($auth);
    $innerRouter->get(
      '/files/items/{itemId}/raw',
      '\App\Controllers\Files:getFile',
    );

    // Users
    $innerRouter
      ->group('/users', function (Router $innerRouter) {
        $innerRouter->get('', '\App\Controllers\Users:getInfo');

        $innerRouter->group('/items', function (Router $innerRouter) {
          $innerRouter->get('', '\App\Controllers\Users:getMany');
          $innerRouter->post('/create', '\App\Controllers\Users:create');

          $innerRouter->group('/{itemId}', function (Router $innerRouter) {
            $innerRouter->patch('', '\App\Controllers\Users:update');
            $innerRouter->delete('', '\App\Controllers\Users:delete');

            $innerRouter->patch('/block', '\App\Controllers\Users:block');
            $innerRouter->patch('/unblock', '\App\Controllers\Users:unblock');
            $innerRouter->patch(
              '/request-password-reset',
              '\App\Controllers\Users:requestPasswordReset',
            );
          });
        });
      })
      ->add($permissionMiddleware)
      ->add($auth);
    $innerRouter
      ->get('/users/items/{itemId}', '\App\Controllers\Users:getOne')
      ->add($auth);

    // User roles
    $innerRouter
      ->group('/{route:user-roles|userRoles}', function (Router $innerRouter) {
        $innerRouter->get('', '\App\Controllers\UserRoles:getInfo');

        $innerRouter->group('/items', function (Router $innerRouter) {
          $innerRouter->get('', '\App\Controllers\UserRoles:getMany');
          $innerRouter->post('/create', '\App\Controllers\UserRoles:create');

          $innerRouter->group('/{itemId}', function (Router $innerRouter) {
            $innerRouter->patch('', '\App\Controllers\UserRoles:update');
            $innerRouter->delete('', '\App\Controllers\UserRoles:delete');
          });
        });
      })
      ->add($permissionMiddleware)
      ->add($auth);
    $innerRouter
      ->get(
        '/{route:user-roles|userRoles}/items/{itemId}',
        '\App\Controllers\UserRoles:getOne',
      )
      ->add($auth);

    // Other
    $innerRouter->group('/{modelId}', function (Router $innerRouter) use (
      $auth,
      $permissionMiddleware,
      $entryTypeMiddleware
    ) {
      $innerRouter
        ->get('', '\App\Controllers\EntryType:getInfo')
        ->add($entryTypeMiddleware)
        ->add($auth);

      $innerRouter
        ->group('/items', function (Router $innerRouter) {
          $innerRouter->get('', '\App\Controllers\EntryType:getMany');
          $innerRouter->patch('/reorder', '\App\Controllers\EntryType:swapTwo');
          $innerRouter->post('/create', '\App\Controllers\EntryType:create');

          $innerRouter->group('/{itemId}', function (Router $innerRouter) {
            $innerRouter->get('', '\App\Controllers\EntryType:getOne');
            $innerRouter->patch('', '\App\Controllers\EntryType:update');
            $innerRouter->delete('', '\App\Controllers\EntryType:delete');
          });
        })
        ->add($permissionMiddleware)
        ->add($entryTypeMiddleware)
        ->add($auth);
    });
  });
};
