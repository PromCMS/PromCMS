<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Users
{
  private $container;
  private $currentUser;

  public function __construct(Container $container)
  {
    $this->container = $container;
    $this->passwordService = $container->get('password-service');
    $this->currentUser = $container->get('session')->get('user', false);
  }

  public function getInfo(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $instance = new \Users();

    prepareJsonResponse($response, (array) $instance->getSummary());

    return $response;
  }

  public function getMany(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $queryParams = $request->getQueryParams();
    $page = isset($queryParams['page']) ? $queryParams['page'] : 0;
    $where = [];
    $whereIn = [];

    if (isset($queryParams['where'])) {
      [$where, $whereIn] = normalizeWhereQueryParam($queryParams['where']);
    }

    //echo json_encode($whereIn);

    $query = \Users::where($where);
    if (count($whereIn)) {
      foreach ($whereIn as $whereInItem) {
        $query->whereIn($whereInItem[0], $whereInItem[1]);
      }
    }

    $result = $query->paginate(15, ['*'], 'page', $page);
    $dataPaginated = json_decode($result->toJson());

    // Unset some things as they are not useful or active
    unset($dataPaginated->links);
    unset($dataPaginated->first_page_url);
    unset($dataPaginated->last_page_url);
    unset($dataPaginated->next_page_url);
    unset($dataPaginated->prev_page_url);
    unset($dataPaginated->path);

    $response->getBody()->write(json_encode($dataPaginated));

    return $response;
  }

  public function update(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();
    $user = $this->container->get('session')->get('user');

    if ($user->id === $args['itemId']) {
      return $response
        ->withStatus(400)
        ->withHeader('Content-Description', 'cannot change self by this route');
    }

    if (isset($parsedBody['data']['password'])) {
      unset($parsedBody['data']['password']);
    }

    try {
      $user = \Users::findOrFail($args['itemId']);
      $user->update($parsedBody['data']);

      prepareJsonResponse($response, $user->toArray());

      return $response;
    } catch (\Exception $ex) {
      if ($ex->getCode() === '23000') {
        $errorText = str_replace(
          ['UNIQUE constraint failed: ', ' '],
          '',
          $ex->errorInfo[2],
        );

        prepareJsonResponse(
          $response,
          array_map(function ($item) {
            return strpos($item, '.') !== false
              ? explode('.', $item)[1]
              : explode('_', $item)[1];
          }, explode(',', $errorText)),
          'Duplicate entries',
          intval($ex->getCode()),
        );

        return $response
          ->withStatus(400)
          ->withHeader('Content-Description', $ex->getMessage());
      }

      return $response
        ->withStatus(500)
        ->withHeader('Content-Description', $ex->getMessage());
    }
  }

  public function getOne(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    try {
      // If is not admin then we will return just id and name for safety reasons
      if (strval($this->currentUser->role) === '0') {
        $item = \Users::findOrFail($args['itemId']);
      } else {
        $item = \Users::select('id', 'name')->findOrFail($args['itemId']);
      }

      prepareJsonResponse($response, $item->toArray());

      return $response;
    } catch (\Exception $e) {
      return $response->withStatus(404);
    }
  }

  public function create(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();
    $jwtService = $this->container->get('jwt-service');
    $emailService = $this->container->get('email');
    $twigService = $this->container->get('twig');

    if (isset($parsedBody['data']['password'])) {
      unset($parsedBody['data']['password']);
    }
    $parsedBody['data']['state'] = 'invited';

    // Generate random password, because user will choose their password by themselves
    $parsedBody['data']['password'] = $this->passwordService->generate(
      base64_encode(random_bytes(10)),
    );

    try {
      $user = \Users::create($parsedBody['data'])->toArray();
    } catch (\Exception $ex) {
      if ($ex->getCode() === '23000') {
        return $response
          ->withStatus(409)
          ->withHeader('Content-Description', $ex->getMessage());
      }

      return $response
        ->withStatus(500)
        ->withHeader('Content-Description', $ex->getMessage());
    }

    $generatedJwt = $jwtService->generate(['id' => $user['id']]);

    prepareJsonResponse($response, $user);

    $themePayload = array_merge($user, [
      'token' => $generatedJwt,
      'app_url' => $_ENV['APP_URL'],
    ]);

    try {
      $generatedEmailContent = $twigService->render(
        'email/invite-user.twig',
        $themePayload,
      );
    } catch (\Exception $e) {
      $loader = new \Twig\Loader\ArrayLoader([
        'index' =>
          'Welcome, {{ name }}! Please continue with your registration <a href="{{ app_url }}/admin/finalize-registration?token={{ token }}">here</a>!',
      ]);
      $twig = new \Twig\Environment($loader);

      $generatedEmailContent = $twig->render('index', $themePayload);
    }

    $emailService->isHtml();
    $emailService->addAddress($user['email'], $user['name']);
    $emailService->Subject = 'Finalize registration';
    $emailService->Body = $generatedEmailContent;
    $emailService->send();

    return $response;
  }

  public function delete(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    prepareJsonResponse(
      $response,
      \Users::findOrFail($args['itemId'])
        ->delete()
        ->toArray(),
    );

    return $response;
  }

  public function block(
    ServerRequestInterface $request,
    ResponseInterface $response,
    $args
  ) {
    $user = \Users::findOrFail($args['itemId']);

    $user->state = 'blocked';
    $user->save();

    prepareJsonResponse($response, $user->toArray());

    return $response;
  }

  public function unblock(
    ServerRequestInterface $request,
    ResponseInterface $response,
    $args
  ) {
    $user = \Users::findOrFail($args['itemId']);

    if ($user->state !== 'blocked') {
      return $response->withStatus(400);
    }

    $user->state = 'active';
    $user->save();

    prepareJsonResponse($response, $user->toArray());

    return $response;
  }

  public function requestPasswordReset(
    ServerRequestInterface $request,
    ResponseInterface $response,
    $args
  ) {
    $params = $request->getQueryParams();
    $jwtService = $this->container->get('jwt-service');
    $emailService = $this->container->get('email');
    $twigService = $this->container->get('twig');

    $user = \Users::findOrFail($args['itemId']);
    if ($user->state === 'blocked') {
      return $response->withStatus(400);
    }

    $generatedJwt = $jwtService->generate(['id' => $user['id']]);
    $themePayload = [
      'name' => $user->name,
      'email' => $user->email,
      'id' => $user->id,
      'token' => $generatedJwt,
      'app_url' => $_ENV['APP_URL'],
    ];

    try {
      $generatedEmailContent = $twigService->render(
        'email/password-reset',
        $themePayload,
      );
    } catch (\Exception $e) {
      $loader = new \Twig\Loader\ArrayLoader([
        'index' =>
          'Hey, {{ name }}! We noticed that you requested a password reset. Please continue <a href="{{ app_url }}/admin/reset-password?token={{ token }}">here</a>!',
      ]);
      $twig = new \Twig\Environment($loader);

      $generatedEmailContent = $twig->render('index', $themePayload);
    }

    $emailService->isHtml();
    $emailService->addAddress($user->email, $user->name);
    $emailService->Subject = 'Password reset';
    $emailService->Body = $generatedEmailContent;

    // If user is invited the this whole function is for resending whole token
    if ($user->state !== 'invited') {
      $user->state = 'password-reset';
    }

    $user->save();
    $emailService->send();

    prepareJsonResponse($response, $user->toArray());

    return $response;
  }
}
