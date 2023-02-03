import {
  capitalizeFirstLetter,
  ColumnType,
  GeneratorConfig,
} from '@prom-cms/shared';
import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { formatCodeString, getTemplateFolder } from '@utils';

const columnTypeToCast = (type: ColumnType['type']) => {
  let finalType = 'string';

  switch (type) {
    case 'json':
      finalType = 'array';
      break;
    default:
      break;
  }

  return finalType;
};

/**
 * Creates a models by provided config
 */
const generateModels = async (
  moduleRoot: string,
  {
    models: configModels,
    singletons: configSingletons,
  }: GeneratorConfig['database']
) => {
  const modelsRoot = path.join(moduleRoot, 'Models');
  const templatesRoot = getTemplateFolder('parts.generate-models');
  // FIXME: Keys from singletons will override some duplicates in models
  const models = { ...configModels, ...configSingletons };

  for (const [modelKey, currentModel] of Object.entries(models)) {
    const capitalizedModelName = capitalizeFirstLetter(modelKey, false);
    const isSingleton = configSingletons && modelKey in configSingletons;

    const info = {
      modelName: capitalizedModelName,
      isSingleton,
      ...currentModel,
      columnCasts: Object.entries(currentModel.columns)
        .filter(([_, { type }]) => type === 'json')
        .map(([key, { type }]) => [key, columnTypeToCast(type)]),
      events: {
        shouldInclude() {
          return (
            this.beforeSave.shouldInclude() || this.afterCreated.shouldInclude()
          );
        },
        beforeSave: {
          shouldInclude() {
            return this.slugify;
          },

          slugify: !!Object.entries(currentModel.columns).find(
            ([_colKey, col]) => col.type === 'slug'
          ),
        },
        afterCreated: {
          shouldInclude() {
            return this.ordering;
          },

          ordering: 'sorting' in currentModel && currentModel.sorting,
        },
      },
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
    const moduleFilename = `${capitalizedModelName}.model.php`;
    const moduleTemplateString = fs.readFileSync(
      path.join(templatesRoot, 'common.ejs'),
      'utf-8'
    );
    const moduleFilepath = path.join(modelsRoot, moduleFilename);
    const moduleResult = await formatCodeString(
      ejs.render(moduleTemplateString, info),
      moduleFilename
    );
    await fs.ensureFile(moduleFilepath);
    await fs.writeFile(moduleFilepath, moduleResult);
  }
};

export default generateModels;
