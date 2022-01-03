import path, { dirname } from 'path';
import fs from 'fs-extra';
import { formatCodeString } from '../utils';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generates a basic controllers
 * @param moduleRoot
 */
const generateControllers = async (moduleRoot: string) => {
  const controllersRoot = path.join(moduleRoot, 'Controllers');
  const templatesRoot = path.join(__dirname, '_templates');
  const templateFiles = fs.readdirSync(templatesRoot);

  for (const templateFilename of templateFiles) {
    const finalFilename = path.parse(templateFilename).name;

    const rawString = fs.readFileSync(
      path.join(templatesRoot, templateFilename),
      'utf-8'
    );

    let result = ejs.render(rawString);

    result = formatCodeString(result, finalFilename);

    const filepath = path.join(controllersRoot, finalFilename);
    await fs.ensureFile(filepath);
    await fs.writeFile(filepath, result);
  }
};

export default generateControllers;
