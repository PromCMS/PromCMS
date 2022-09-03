<?php

namespace App\Services;

class Password
{
  private function removeSpaces(string $text)
  {
    return preg_replace('/\s+/', '', $text);
  }

  public function generate(string $password)
  {
    $spacelessPassword = $this->removeSpaces($password);

    return password_hash($spacelessPassword, PASSWORD_DEFAULT, [
      'cost' => 12
    ]);
  }

  public function validate(string $newPassword, string $hashedPassword)
  {
    $spacelessPassword = $this->removeSpaces($newPassword);

    return password_verify($spacelessPassword, $hashedPassword);
  }
}