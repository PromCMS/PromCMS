import path from 'path';
import { generateByTemplates } from '../../../utils';
import { TEMPLATES_ROOT } from '../../../constants';

/**
 * Generates a core middleware
 * @param moduleRoot
 */
const generateMiddleware = async (moduleRoot: string) => {
  const servicesRoot = path.join(moduleRoot, 'Http', 'Middleware');
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-core-module',
    'generate-middleware'
  );

  await generateByTemplates(templatesRoot, servicesRoot);
};

export default generateMiddleware;
