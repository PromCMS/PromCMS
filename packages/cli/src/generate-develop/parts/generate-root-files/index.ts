import path, { dirname } from 'path';
import { generateByTemplates } from '../../../parts/utils';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generates a basic controllers
 * @param moduleRoot
 */
const generateRootFiles = async (moduleRoot: string) => {
  const templatesRoot = path.join(__dirname, '_templates');

  generateByTemplates(templatesRoot, moduleRoot);
};

export default generateRootFiles;
