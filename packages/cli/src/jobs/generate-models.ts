import { capitalizeFirstLetter } from '@prom-cms/shared';
import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { formatCodeString, getTemplateFolder } from '@utils';
import { GeneratorConfig } from '@prom-cms/schema';
import { MODELS_FOLDER_NAME } from '@constants';
import slugify from 'slugify';

type ModelColumns = NonNullable<
  GeneratorConfig['database']['models']
>[string]['columns'];
type SingletonColumns = NonNullable<
  GeneratorConfig['database']['singletons']
>[string]['columns'];

type ColumnType = NonNullable<
  ReturnType<(SingletonColumns | ModelColumns)['get']>
>['type'];

const columnCasts: Partial<{ [key in ColumnType]: string }> = {
  json: 'array',
};

const recursivePrintObject = (obj: object | Map<any, any> | []) => {
  let result = ``;

  if (Array.isArray(obj)) {
    result = `'${obj.join("', '")}'`;
  } else {
    const keys: string[] = [];

    for (const [key, value] of obj instanceof Map ? obj : Object.entries(obj)) {
      let formattedValue = '';

      switch (typeof value) {
        case 'boolean':
        case 'number':
          formattedValue = String(value);
          break;
        case 'object':
          if (Array.isArray(value)) {
            // TODO: this will only result in joined strings
            formattedValue = `['${value.join("', '")}']`;
          } else {
            formattedValue = recursivePrintObject(value);
          }
          break;
        default:
          formattedValue = `'${String(value)}'`;
          break;
      }

      keys.push(`'${key}' => ${formattedValue}`);
    }

    result = keys.join(', ');
  }

  return `[${result}]`;
};

const getColumnCasts = (columns?: SingletonColumns | ModelColumns) => {
  const casts: [string, string][] = [];

  for (const [columnKey, { type }] of (columns || new Map()) as NonNullable<
    typeof columns
  >) {
    if (!columnCasts[type]) {
      continue;
    }

    casts.push([columnKey, columnCasts[type]!]);
  }

  return casts;
};

export type GenerateModelsOptions = {
  moduleRoot: string;
  config: GeneratorConfig;
};

/**
 * Creates a models by provided config
 */
const generateModels = async ({
  config,
  moduleRoot,
}: GenerateModelsOptions) => {
  const modelsRoot = path.join(moduleRoot, MODELS_FOLDER_NAME);
  const templatesRoot = getTemplateFolder('parts.generate-models');
  const { models: modelsFromConfig, singletons } = config.database;

  // FIXME: Keys from singletons will override some duplicates in models
  const models = { ...modelsFromConfig, ...singletons };

  for (const [modelKey, currentModel] of Object.entries(models)) {
    const capitalizedModelName = capitalizeFirstLetter(modelKey, false);
    const isSingleton = singletons && modelKey in singletons;

    const info = {
      modelName: capitalizedModelName,
      isSingleton,
      ...currentModel,
      columnCasts: getColumnCasts(currentModel.columns),
      tableName:
        'tableName' in currentModel
          ? currentModel.tableName
          : slugify.default(capitalizedModelName, {
              replacement: '_',
              lower: true,
              trim: true,
            }),
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

          slugify: !![...currentModel.columns].find(
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
      formattedColumns: [...currentModel.columns].reduce(
        (finalTransformedColumns, [currentColumnKey, currentColumn]) => {
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

            let formattedValue = '';
            switch (typeof settingValue) {
              case 'boolean':
              case 'number':
                formattedValue = String(settingValue);
                break;
              case 'object':
                formattedValue = recursivePrintObject(settingValue);
                break;
              default:
                formattedValue = `'${String(settingValue)}'`;
                break;
            }

            transformedSettings.push(`'${settingsKey}' => ${formattedValue}`);
          }

          // We now take care of those special column types

          // we know for sure that enum column type has enum setting key
          if (currentColumn.type === 'enum') {
            transformedSettings.push(
              `'enum' => ['${currentColumn.enum.join("', '")}']`
            );
          }

          finalTransformedColumns.set(currentColumnKey, transformedSettings);

          return finalTransformedColumns;
        },
        new Map<string, string[]>()
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
