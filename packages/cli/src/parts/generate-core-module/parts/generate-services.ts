import { TEMPLATES_ROOT } from '../../../constants';
import path from 'path';
import { generateByTemplates } from '../../../utils';

/**
 * Generates a core services
 * @param moduleRoot
 */
const generateServices = async (moduleRoot: string) => {
  const servicesRoot = path.join(moduleRoot, 'Services');
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-core-module',
    'generate-services'
  );

  await generateByTemplates(templatesRoot, servicesRoot);
};

export default generateServices;
