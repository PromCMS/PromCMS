import path, { dirname } from 'path';
import { generateByTemplates } from '../../../parts/utils';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generates a core services
 * @param moduleRoot
 */
const generateServices = async (moduleRoot: string) => {
  const servicesRoot = path.join(moduleRoot, 'Services');
  const templatesRoot = path.join(__dirname, '_templates');

  generateByTemplates(templatesRoot, servicesRoot);
};

export default generateServices;
