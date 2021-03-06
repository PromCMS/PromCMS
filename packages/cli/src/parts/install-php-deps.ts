import { execa } from 'execa';

export const installPHPDeps = async (appRoot: string) => {
  const depsList = [
    'slim/slim:4.*',
    'illuminate/pagination:8.77.1',
    'guzzlehttp/psr7:^2',
    'guzzlehttp/guzzle:^7.4',
    'php-di/php-di:^6.3',
    'illuminate/database:^8.77',
    'bryanjhv/slim-session:^4.0',
    'league/flysystem:2.1.1',
    'firebase/php-jwt:^6.0',
    'paragonie/sodium_compat:^1.17',
    'phpmailer/phpmailer:^6.6',
    'twig/twig:^3.0',
    'symfony/dotenv:^5.4',
    'illuminate/events:^8.83',
  ];

  const devDepsList = ['fakerphp/faker:^1.9.1', 'mockery/mockery:^1.3.1'];

  await execa('composer', ['require', ...depsList], {
    cwd: appRoot,
  });

  await execa('composer', ['require', '--dev', ...devDepsList], {
    cwd: appRoot,
  });
};
