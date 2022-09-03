import generateModule from '../../parts/generate-module';
import type { ExportConfig } from '@prom-cms/shared';
import path from 'path';
import generateStaticFiles from './parts/generate-static-files';
import generateModels from './parts/generate-models';

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
    author: `PromCMS${isDev ? ' Developer' : ''}`,
    description: isDev
      ? 'This is just for development purposes.'
      : 'Key module that provides functionality to this CMS. DO NOT DELETE!',
  });

  // Logger.info('🔃 Generating models...');
  await generateModels(DEV_MODULE_ROOT, configModels);

  // Logger.info('🔃 Creating api routes...');
  await generateStaticFiles(DEV_MODULE_ROOT);

  // Logger.success('✅ Generating development module into core done!');
};
