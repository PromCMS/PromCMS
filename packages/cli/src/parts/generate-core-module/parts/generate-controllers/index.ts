import path, { dirname } from 'path';
import { generateByTemplates } from '../../../../utils';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generates a basic controllers
 * @param moduleRoot
 */
const generateControllers = async (moduleRoot: string) => {
  const controllersRoot = path.join(moduleRoot, 'Controllers');
  const templatesRoot = path.join(__dirname, '_templates');

  await generateByTemplates(templatesRoot, controllersRoot);
};

export default generateControllers;
