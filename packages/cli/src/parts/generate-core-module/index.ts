import generateModule from '../../parts/generate-module/index.js';
import type { ExportConfig } from '@prom-cms/shared';
import path from 'path';
import generateApiRoutes from './parts/generate-api-routes/index.js';
import generateControllers from './parts/generate-controllers/index.js';
import generateMiddleware from './parts/generate-middleware/index.js';
import generateModels from './parts/generate-models/index.js';
import generateRootFiles from './parts/generate-root-files/index.js';
import generateServices from './parts/generate-services/index.js';

/**
 * Generates a core module as a whole
 * @param moduleRoot
 */
export const generateCoreModule = async (
  modulesRoot: string,
  configModels: ExportConfig['database']['models'],
  isDev: boolean = true
) => {
  const MODULE_NAME = 'Core';
  const DEV_MODULE_ROOT = path.join(modulesRoot, MODULE_NAME);

  await generateModule(modulesRoot, MODULE_NAME, {
    author: `PROM CMS${isDev ? ' Developer' : ''}`,
    description: isDev
      ? 'This is just for development purposes.'
      : 'Key module that provides functionality to this CMS. DO NOT DELETE!',
  });

  //Logger.info('🔃 Creating root files...');
  await generateRootFiles(DEV_MODULE_ROOT);

  // Logger.info('🔃 Generating models...');
  await generateModels(DEV_MODULE_ROOT, configModels);

  // Logger.info('🔃 Creating services...');
  await generateServices(DEV_MODULE_ROOT);

  // Logger.info('🔃 Creating controllers...');
  await generateControllers(DEV_MODULE_ROOT);

  // Logger.info('🔃 Creating api middleware...');
  await generateMiddleware(DEV_MODULE_ROOT);

  // Logger.info('🔃 Creating api routes...');
  await generateApiRoutes(DEV_MODULE_ROOT);

  // Logger.success('✅ Generating development module into core done!');
};
