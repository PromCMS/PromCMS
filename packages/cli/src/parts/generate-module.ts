import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import { formatCodeString } from '../utils';
import { TEMPLATES_ROOT } from '../constants';

/**
 * Creates a PROM CMS module to specified directory with bootstrapped content.
 * @param pluginsRoot Root of module
 * @param pluginName Name of module
 * @param param2 Some additional settings
 */
const generateModule = async (
  pluginsRoot: string,
  _pluginName: string,
  { description, author }: { description?: string; author?: string } = {}
) => {
  const pluginName = capitalizeFirstLetter(_pluginName, false);
  const pluginRoot = path.join(pluginsRoot, pluginName);

  await fs.emptyDir(pluginRoot);

  if (fs.existsSync(pluginRoot) && fs.readdirSync(pluginRoot).length)
    throw Error(`Folder "${pluginName}" does not appear to be empty.`);

  const templatesRoot = path.join(TEMPLATES_ROOT, 'parts', 'generate-module');
  const templateFiles = fs.readdirSync(templatesRoot);

  for (const templateFilename of templateFiles) {
    const finalFilename = path.parse(templateFilename).name;

    const rawString = fs.readFileSync(
      path.join(templatesRoot, templateFilename),
      'utf-8'
    );

    let result = ejs.render(
      rawString,
      {
        description,
        name: pluginName,
      },
      {}
    );

    result = await formatCodeString(result, finalFilename);

    const filepath = path.join(pluginRoot, finalFilename);
    await fs.ensureFile(filepath);
    await fs.writeFile(filepath, result);
  }
};

export default generateModule;
