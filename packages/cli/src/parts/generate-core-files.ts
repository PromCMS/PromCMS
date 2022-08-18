import { TEMPLATES_ROOT } from '../constants';
import path from 'path';
import { generateByTemplates } from '../utils';

const generateCore = async (projectRoot: string) => {
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-core-files'
  );

  await generateByTemplates(templatesRoot, projectRoot);
};

export default generateCore;
