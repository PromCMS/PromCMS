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
    const currentModel = configModels[modelKey];

    const info = {
      softDelete: false,
      timestamp: false,
      tableName: modelKey.toLocaleLowerCase(),
      modelName: capitalizedModelName,
      ...currentModel,
      formattedColumns: Object.keys(currentModel.columns).reduce(
        (finalTransformedColumns, currentColumnKey) => {
          const currentColumn = currentModel.columns[currentColumnKey];
          const transformedSettings: string[] = [];

          // Some column types are special and need some special logic
          // we offload that logic outside of those that are simple values
          const commonSettingsKeys = Object.keys(currentColumn).filter(
            (settingKey) => !['enum'].includes(settingKey)
          );
          for (const settingsKey of commonSettingsKeys) {
            // translates to php-like structure
            // We also use String here since we may also encounter some boolean values which we just translate to its string
            const settingValue = currentColumn[settingsKey];
            const formattedValue =
              typeof settingValue === 'boolean'
                ? String(settingValue)
                : `'${String(settingValue)}'`;

            transformedSettings.push(`'${settingsKey}' => ${formattedValue}`);
          }

          // We now take care of those special column types

          // we know for sure that enum column type has enum setting key
          if (currentColumn.type === 'enum') {
            transformedSettings.push(
              `'enum' => ['${currentColumn.enum.join("', '")}']`
            );
          }

          return {
            ...finalTransformedColumns,
            [currentColumnKey]: transformedSettings,
          };
        },
        {} as Record<string, string[]>
      ),
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
