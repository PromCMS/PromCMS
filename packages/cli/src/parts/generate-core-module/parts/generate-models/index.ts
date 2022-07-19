import {
  capitalizeFirstLetter,
  ColumnType,
  ExportConfig,
  FileColumnType,
  RelationshipColumnType,
} from '@prom-cms/shared';
import fs from 'fs-extra';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { formatCodeString } from '../../../../utils/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const columnTypeToCast = (type: ColumnType['type']) => {
  let finalType = 'string';

  switch (type) {
    case 'json':
      finalType = 'array';
      break;
    case 'boolean':
      finalType = 'boolean';
      break;
    default:
      break;
  }

  return finalType;
};

const virtualByModel = {
  files: [
    {
      name: 'path',
      accessKey: 'Path',
      content: `return $config['app']['baseUrl'] . "/api/entry-types/files/items/{$this->id}/raw";`,
    },
  ],
};

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
    const capitalizedModelName = capitalizeFirstLetter(modelKey, false);
    const currentModel = configModels[modelKey];
    const info = {
      modelName: capitalizedModelName,
      ...currentModel,
      relationships: (
        Object.entries(currentModel.columns).filter(
          ([_key, { type }]) => type === 'file' || type === 'relationship'
        ) as [string, FileColumnType | RelationshipColumnType][]
      ).map(([key, props]) => [
        key,
        props.type === 'file'
          ? {
              type: props.multiple ? 'oneToMany' : 'oneToOne',
              fill: true,
              target: '\\Files::class',
              foreignKey: 'id',
            }
          : {
              type: props.multiple ? 'oneToMany' : 'oneToOne',
              fill: props.fill,
              target: `\\${capitalizeFirstLetter(
                props.targetModel,
                false
              )}::class`,
              foreignKey: props.foreignKey,
            },
      ]),
      columnCasts: Object.entries(currentModel.columns)
        .filter(([_, { type }]) => type === 'json' || type === 'boolean')
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

          ordering: currentModel.sorting,
        },
      },
      virtuals: virtualByModel[modelKey.toLowerCase()] ?? [],
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
      path.join(templatesRoot, 'model', 'common.ejs'),
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
