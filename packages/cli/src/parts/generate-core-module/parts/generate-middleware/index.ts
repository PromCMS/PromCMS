import path, { dirname } from 'path';
import { generateByTemplates } from '../../../../utils/index.js';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generates a core middleware
 * @param moduleRoot
 */
const generateMiddleware = async (moduleRoot: string) => {
  const servicesRoot = path.join(moduleRoot, 'Http', 'Middleware');
  const templatesRoot = path.join(__dirname, '_templates');

  await generateByTemplates(templatesRoot, servicesRoot);
};

export default generateMiddleware;
