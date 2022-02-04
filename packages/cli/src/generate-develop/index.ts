import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import Database from 'better-sqlite3';
import {
  formatGeneratorConfig,
  GENERATOR_CONFIG,
  getEnvFilepath,
  loadRootEnv,
  PROJECT_ROOT,
  CORE_ROOT,
} from '@prom/shared';
import {
  generateModule,
  generateModels,
  seedDatabase,
  syncDatabase,
} from '../parts';
import {
  generateApiRoutes,
  generateControllers,
  generateRootFiles,
  generateServices,
} from './parts';

loadRootEnv();
const envFilepath = getEnvFilepath();
const { DB_CONNECTION, DB_DATABASE } = process.env as {
  DB_CONNECTION: string;
  DB_DATABASE: string;
};

if (!envFilepath)
  throw '⛔️ Please provide .env file in your root folder and run this command again!';
if (!GENERATOR_CONFIG)
  throw '⛔️ No generator config provided, please provide a config somehow.';
if (DB_CONNECTION !== 'sqlite')
  throw '⛔️ At the moment we dont provide a way to seed database other than SQLITE.';

const info = (text: any) => console.log(chalk.bold.blue(text));
const success = (text: any) => console.log(chalk.bold.green(text));
const db = new Database(path.join(CORE_ROOT, DB_DATABASE));
const { database: databaseConfig } = formatGeneratorConfig(GENERATOR_CONFIG);

const MODULE_NAME = 'Core';

const DEV_API_ROOT = path.join(PROJECT_ROOT, 'packages', 'dev-api');
const CORE_MODULES_ROOT = path.join(CORE_ROOT, 'modules');
const DEV_API_MODULES_ROOT = path.join(DEV_API_ROOT, '.temp', 'modules');
const DEV_MODULE_ROOT = path.join(DEV_API_MODULES_ROOT, MODULE_NAME);

success(
  '🙇‍♂️ Welcome back, PROM DEVELOPER! Sit back a few seconds while we prepare development...'
);

info('🔃 Generating development module into core...');
await generateModule(DEV_API_MODULES_ROOT, MODULE_NAME, {
  author: 'PROM CMS Developer',
  description: 'This is just for development purposes.',
});

info('🔃 Making symlink of development module into core as a module...');
const modules = fs.readdirSync(DEV_API_MODULES_ROOT);
for (const moduleName of modules) {
  await fs.createSymlink(
    path.join(DEV_API_MODULES_ROOT, moduleName),
    path.join(CORE_MODULES_ROOT, moduleName),
    'dir'
  );
}

info('🔃 Making symlink of .env variable file from project root...');
await fs.createSymlink(envFilepath, path.join(CORE_ROOT, '.env'), 'file');

info('🔃 Creating root files...');
await generateRootFiles(DEV_MODULE_ROOT);

info('🔃 Creating services...');
await generateServices(DEV_MODULE_ROOT);

info('🔃 Generating models...');
await generateModels(DEV_MODULE_ROOT, databaseConfig.models);

info('🔃 Creating controllers...');
await generateControllers(DEV_MODULE_ROOT);

info('🔃 Creating api routes...');
await generateApiRoutes(DEV_MODULE_ROOT);

info('🔃 Syncing database with models...');
await syncDatabase();

info('🔃 Seeding database...');
seedDatabase(db, databaseConfig);

db.close();

success('✅ Everything done and ready! Bye.');
