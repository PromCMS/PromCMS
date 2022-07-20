import path from 'path';
import { generateByTemplates } from '../../../utils';
import { TEMPLATES_ROOT } from '../../../constants';

/**
 * Generates a basic controllers
 * @param moduleRoot
 */
const generateRootFiles = async (moduleRoot: string) => {
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-core-module',
    'generate-root-files'
  );

  await generateByTemplates(templatesRoot, moduleRoot);
};

export default generateRootFiles;
