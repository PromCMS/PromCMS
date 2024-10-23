import module from 'node:module';

console.log(
  module.createRequire(import.meta.url)('@prom-cms/schema/package.json')
);
