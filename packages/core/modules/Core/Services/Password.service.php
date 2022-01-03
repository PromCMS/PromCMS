<?php

namespace App\Services;

class Password
{
  public function generate(string $password)
  {
    return password_hash($password, PASSWORD_DEFAULT, ["cost" => 9]);
  }

  public function validate(string $newPassword, string $hashedPassword)
  {
    return password_verify($newPassword, $hashedPassword);
  }
}
