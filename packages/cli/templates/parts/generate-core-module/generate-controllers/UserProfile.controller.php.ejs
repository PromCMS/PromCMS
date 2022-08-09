<?php

namespace App\Controllers;

use DI\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UserProfile
{
  private $container;
  private $jwt;
  private $passService;

  public function __construct(Container $container)
  {
    $this->container = $container;
    $this->jwt = $container->get('jwt-service');
    $this->passService = $container->get('password-service');
  }

  public function getCurrent(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $user = $this->container->get('session')->get('user');

    prepareJsonResponse($response, $user->getData());

    return $response;
  }

  public function login(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $userId = $this->container->get('session')->get('user_id', false);
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
        $user = \Users::where(['email', '=', $args['email']])->getOne();
        $userState = $user->state;
        $passwordIsValid = $this->passService->validate(
          $args['password'],
          $user->password,
        );

        if (!$passwordIsValid) {
          throw new \Exception('Wrong password');
        }

        if (
          $userState === 'password-reset' ||
          $userState === 'blocked' ||
          $userState === 'invited'
        ) {
          $userCannotLoginBecauseOfState = true;
          throw new \Exception("user-state-$userState");
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
    $user = $this->container->get('session')->get('user');
    $parsedBody = $request->getParsedBody();

    if (!$parsedBody['data']) {
      return $response->withStatus(400);
    }
    $data = $parsedBody['data'];

    if (isset($data['id'])) {
      unset($data['id']);
    }

    // Unset items that user should not remove by themselves
    if (isset($data['password'])) {
      unset($data['password']);
    }

    if (isset($data['role'])) {
      unset($data['role']);
    }

    if (isset($data['state'])) {
      unset($data['state']);
    }

    $user->update($data);

    prepareJsonResponse($response, $user->getData());

    return $response;
  }

  public function logout(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $this->container->get('session')::destroy();

    prepareJsonResponse($response, [], '', 'success');

    return $response;
  }

  /**
   * User have forgot theirs password and requested renewal when logged of
   */
  public function requestPasswordReset(
    ServerRequestInterface $request,
    ResponseInterface $response
  ) {
    $params = $request->getQueryParams();
    $emailService = $this->container->get('email');
    $twigService = $this->container->get('twig');

    if (!$params['email']) {
      return $response->withStatus(400);
    }

    try {
      $user = \Users::where([
        ['email', '=', $params['email']],
        'AND',
        ['state', '!=', 'blocked'],
      ])->getOne();
    } catch (\Exception $e) {
      // We did not find user on provided email, but we do not want to let user know about it since we do not want to expose anything to public
      return $response;
    }

    $generatedJwt = $this->jwt->generate(['id' => $user->id]);
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
    $user->update([
      'state' => 'password-reset',
    ]);

    $emailService->send();

    return $response;
  }

  /**
   * Finalizing of password renewal via token
   */
  public function finalizePasswordReset(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $params = $request->getParsedBody();
    $token = $params['token'];
    $newPassword = $params['new_password'];
    $decodedPayload = $this->jwt->validate($token);

    if (!$decodedPayload) {
      return $response->withStatus(401);
    }

    $decodedArray = (array) $decodedPayload;

    try {
      $user = \Users::getOneById($decodedArray['id']);
    } catch (\Exception $e) {
      return $response->withStatus(404);
    }

    $user->update([
      'password' => $this->passService->generate($newPassword),
      'state' => 'active',
    ]);

    return $response;
  }

  // TODO
  public function requestEmailChange(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    return $response;
  }

  // TODO
  public function finalizeEmailChange(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    return $response;
  }
}
