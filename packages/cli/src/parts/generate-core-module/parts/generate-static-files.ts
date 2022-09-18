import path from 'path';
import { generateByTemplates } from '../../../utils';
import { TEMPLATES_ROOT } from '../../../constants';

const generateStaticFiles = async (moduleRoot: string) => {
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-core-module',
    'generate-static-files'
  );

  await generateByTemplates(templatesRoot, moduleRoot);
};

export default generateStaticFiles;
