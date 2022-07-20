import { TEMPLATES_ROOT } from '../constants';
import path from 'path';
import { generateByTemplates } from '../utils';

const generateCore = async (
  projectRoot: string,
  regenerate: boolean = false
) => {
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-core-files'
  );

  // Small hacky way to just regenerate whats inside an app folder
  if (regenerate) {
    await generateByTemplates(templatesRoot, projectRoot);
  } else {
    await generateByTemplates(
      path.join(templatesRoot, 'app'),
      path.join(projectRoot, 'app')
    );
  }
};

export default generateCore;
