<?php

namespace App\Services;

use DI\Container;
use Firebase\JWT\JWT as JWTWorker;
use Firebase\JWT\Key;

class JWT
{
  private $config;

  public function __construct(Container $container)
  {
    $this->config = $container->get('config');
  }

  public function generate($payload, int $expiration = null)
  {
    $now = time();

    return JWTWorker::encode(
      array_merge(
        [
          'iat' => $now,
          'exp' =>
            $now +
            ($expiration === null
              ? $this->config['security']['token']['lifetime']
              : $expiration),
        ],
        $payload,
      ),
      $_ENV['SECURITY_SECRET'],
      'HS256',
    );
  }

  public function validate(string $jwt)
  {
    return JWTWorker::decode($jwt, new Key($_ENV['SECURITY_SECRET'], 'HS256'));
  }
}
