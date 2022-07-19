import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateByTemplates } from '../../utils/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const generateCore = async (
  projectRoot: string,
  regenerate: boolean = false
) => {
  const templatesRoot = path.join(__dirname, '_templates');

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
