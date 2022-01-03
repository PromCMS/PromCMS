<?php 
  include_once (__DIR__."/../../../../core/modules/Core/Services/Password.service.php");

  use App\Services\Password as PasswordService;

  $passwordService = new PasswordService();

  echo $passwordService->generate($argv[0]);
