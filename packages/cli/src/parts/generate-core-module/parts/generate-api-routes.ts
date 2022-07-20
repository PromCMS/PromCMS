import path from 'path';
import { generateByTemplates } from '../../../utils';
import { TEMPLATES_ROOT } from '../../../constants';

const generateApiRoutes = async (moduleRoot: string) => {
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-core-module',
    'generate-api-routes'
  );

  await generateByTemplates(templatesRoot, moduleRoot);
};

export default generateApiRoutes;
