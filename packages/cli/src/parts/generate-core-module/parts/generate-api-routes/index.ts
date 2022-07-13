import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateByTemplates } from '../../../../utils';

const __dirname = dirname(fileURLToPath(import.meta.url));

const generateApiRoutes = async (moduleRoot: string) => {
  const templatesRoot = path.join(__dirname, '_templates');

  await generateByTemplates(templatesRoot, moduleRoot);
};

export default generateApiRoutes;
