<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UserProfile
{
  private $container;

  public function __construct(Container $container)
  {
    $this->container = $container;
  }

  public function getCurrent(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $userId = $this->container->get('session')->get('user_id');

    if (!$userId) {
      return $response;
    }

    $response->getBody()->write(
      json_encode([
        'data' => \Users::where('id', $userId)
          ->get()
          ->firstOrFail(),
      ]),
    );

    return $response;
  }

  public function login(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $userId = $this->container->get('session')->get('user_id', false);

    $passwordService = $this->container->get('password-service');
    $args = $request->getParsedBody();

    $code = 200;
    $responseAry = [
      'result' => 'success',
    ];

    if ($userId !== false) {
      $responseAry['result'] = 'success';
      $responseAry['message'] = 'already logged in';
      $code = 200;
    }

    if (!isset($args['password']) || !isset($args['email'])) {
      $responseAry['result'] = 'error';
      $responseAry['message'] = 'missing params';
      $code = 400;
    } else {
      $userCannotLoginBecauseOfState = false;

      try {
        $user = \Users::where('email', $args['email'])
          ->get()
          ->firstOrFail();
        $passwordIsValid = $passwordService->validate(
          $args['password'],
          $user->password,
        );

        if (!$passwordIsValid) {
          throw new \Exception('Wrong password');
        }

        if (
          $user->state === 'password-reset' ||
          $user->state === 'blocked' ||
          $user->state === 'invited'
        ) {
          $userCannotLoginBecauseOfState = true;
          throw new \Exception("user-state-$user->state");
        }

        $this->container->get('session')->set('user_id', $user->id);
        $responseAry['result'] = 'success';
        $responseAry['message'] = 'successfully logged in';
        $code = 200;
      } catch (\Exception $e) {
        if ($userCannotLoginBecauseOfState) {
          $responseAry['result'] = 'error';
          $responseAry['message'] = 'user cannot login';
          $responseAry['code'] = $e->getMessage();
        } else {
          $responseAry['result'] = 'error';
          $responseAry['code'] = 'invalid-credentials';
          $responseAry['message'] = 'wrong password or email';
        }

        $code = 400;
      }
    }

    $response->getBody()->write(json_encode($responseAry));

    return $response->withStatus($code);
  }

  public function update(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $userId = $this->container->get('session')->get('user_id');
    $parsedBody = $request->getParsedBody();

    if (!$userId) {
      return $response;
    }

    if (!$parsedBody['data']) {
      return $response->withStatus(400);
    }

    if (isset($parsedBody['data']['password'])) {
      unset($parsedBody['data']['password']);
    }

    $response->getBody()->write(
      json_encode([
        'data' => \Users::where('id', $userId)->update($parsedBody['data']),
      ]),
    );

    return $response;
  }

  public function logout(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $this->container->get('session')::destroy();

    $response->getBody()->write(
      json_encode([
        'result' => 'success',
      ]),
    );

    return $response;
  }

  public function requestPasswordReset(
    ServerRequestInterface $request,
    ResponseInterface $response
  ) {
    $params = $request->getQueryParams();
    $jwtService = $this->container->get('jwt-service');
    $emailService = $this->container->get('email');
    $twigService = $this->container->get('twig');

    if (!$params['email']) {
      return $response->withStatus(400);
    }

    try {
      $user = \Users::where('email', $params['email'])
        ->where('state', '!=', 'blocked')
        ->firstOrFail();
    } catch (\Exception $e) {
      // We did not find user on provided email, but we do not want to let user know about it since we do not want to expose anything to public
      return $response;
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
        'email/password-reset.twig',
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

    // User should be supposed to be in this state
    $user->state = 'password-reset';
    $user->save();

    $emailService->send();

    return $response;
  }

  public function finalizePasswordReset(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $params = $request->getParsedBody();
    $jwtService = $this->container->get('jwt-service');
    $passwordService = $this->container->get('password-service');
    $token = $params['token'];
    $newPassword = $params['new_password'];

    $decodedPayload = $jwtService->validate($token);

    if (!$decodedPayload) {
      return $response->withStatus(401);
    }

    $decodedArray = (array) $decodedPayload;

    try {
      $user = \Users::where('id', $decodedArray['id'])
        ->get()
        ->firstOrFail();
    } catch (\Exception $e) {
      return $response->withStatus(404);
    }

    $user->password = $passwordService->generate($newPassword);
    $user->save();

    return $response;
  }

  public function requestEmailChange(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    return $response;
  }

  public function finalizeEmailChange(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    return $response;
  }
}
