import path from 'path';
import { generateByTemplates } from '../../../utils';
import { TEMPLATES_ROOT } from '../../../constants';

/**
 * Generates a basic controllers
 * @param moduleRoot
 */
const generateControllers = async (moduleRoot: string) => {
  const controllersRoot = path.join(moduleRoot, 'Controllers');
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-core-module',
    'generate-controllers'
  );

  await generateByTemplates(templatesRoot, controllersRoot);
};

export default generateControllers;
