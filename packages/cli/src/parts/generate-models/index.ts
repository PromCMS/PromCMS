import { capitalizeFirstLetter, ExportConfig } from '@prom/shared';
import fs from 'fs-extra';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { formatCodeString } from '../utils';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Creates a models by provided config
 */
const generateModels = async (
  moduleRoot: string,
  configModels: ExportConfig['database']['models']
) => {
  const modelsRoot = path.join(moduleRoot, 'Models');
  const templatesRoot = path.join(__dirname, '_templates');

  for (const modelKey in configModels) {
    const capitalizedModelName = capitalizeFirstLetter(modelKey);
    const info = {
      softDelete: false,
      timestamp: false,
      tableName: modelKey.toLocaleLowerCase(),
      modelName: capitalizedModelName,
      ...configModels[modelKey],
    };

    // Module
    const moduleTemplateString = fs.readFileSync(
      path.join(templatesRoot, 'model', 'common.ejs'),
      'utf-8'
    );
    const moduleFilepath = path.join(
      modelsRoot,
      `${capitalizedModelName}.model.php`
    );
    const moduleResult = formatCodeString(
      ejs.render(moduleTemplateString, info),
      moduleFilepath
    );
    await fs.ensureFile(moduleFilepath);
    await fs.writeFile(moduleFilepath, moduleResult);
  }
};

export default generateModels;
