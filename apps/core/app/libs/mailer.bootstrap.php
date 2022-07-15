<?php

use PHPMailer\PHPMailer\PHPMailer;

// Create mailer instance
$mailer = new PHPMailer(true);

// We only talk in SMTP
$mailer->isSMTP();

// Server info
$mailer->Host = $_ENV['MAIL_HOST'];
$mailer->Port = $_ENV['MAIL_PORT'];

// We only talk authorized
$mailer->SMTPAuth = true;
$mailer->SMTPSecure = 'ssl';

// UTF-8 only
$mailer->CharSet = 'UTF-8';

// Set login info
$mailer->Username = $_ENV['MAIL_USER'];
$mailer->Password = $_ENV['MAIL_PASS'];

// Set from to header
$mailer->setFrom(
  isset($_ENV['MAIL_ADDRESS']) ? $_ENV['MAIL_ADDRESS'] : $_ENV['MAIL_USER'],
  $_ENV['APP_NAME'] ? $_ENV['APP_NAME'] : 'PROM Mailer',
);
