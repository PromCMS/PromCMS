import path from 'path';
import { fileURLToPath } from 'url';
import { generateByTemplates } from '../../../../utils/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generates a core services
 * @param moduleRoot
 */
const generateServices = async (moduleRoot: string) => {
  const servicesRoot = path.join(moduleRoot, 'Services');
  const templatesRoot = path.join(__dirname, '_templates');

  await generateByTemplates(templatesRoot, servicesRoot);
};

export default generateServices;
