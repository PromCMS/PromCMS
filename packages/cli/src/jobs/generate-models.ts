import { capitalizeFirstLetter } from '@prom-cms/shared';
import path from 'path';
import { generateByTemplates, getModuleFolderName } from '@utils';
import {
  ColumnType,
  DatabaseConfigModel,
  DatabaseConfigSingleton,
  GeneratorConfig,
} from '@prom-cms/schema';
import { promColumnTypeToPropelType } from '@constants';
import slugify from 'slugify';
import { PropelColumnAttributes, PropelTableAttributes } from '@custom-types';

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

export type GenerateDevelopModelsOptions = {
  config: GeneratorConfig;
  appRoot: string;
};

export const generateModels = async function genereateDevelopmentCoreModels({
  config,
  appRoot,
}: GenerateDevelopModelsOptions) {
  const isModelSingleton = (modelName: string) => {
    const { singletons } = config.database;
    return singletons && modelName in singletons;
  };

  const getTableNameForModel = (
    modelName: string,
    currentModel: DatabaseConfigModel | DatabaseConfigSingleton
  ) => {
    const capitalizedModelName = capitalizeFirstLetter(modelName, false);

    const tableName =
      'tableName' in currentModel
        ? currentModel.tableName
        : slugify.default(capitalizedModelName, {
            replacement: '_',
            lower: true,
            trim: true,
          });

    if (isModelSingleton(modelName)) {
      return `singleton_${tableName}`;
    }

    return tableName;
  };

  for (const [modelName, model] of Object.entries({
    ...config.database.models,
    ...config.database.singletons,
  })) {
    const isSingleton = isModelSingleton(modelName);

    for (const [columnName, column] of model.columns) {
      if (column.type === 'slug') {
        model.columns[column.of].primaryString = true;
      }
    }
  }

  // Module
  await generateByTemplates('parts.generate-models', appRoot, {
    '*': {
      projectNameAsFolderName: getModuleFolderName(config.project.name),
      path,
      config: {
        ...config,
        project: {
          ...config.project,
          root: appRoot,
        },
      },
      capitalizeFirstLetter,
      isModelSingleton,
      objectToXmlAttributes(
        propertiesAsObject: Record<string, any> | undefined
      ) {
        if (!propertiesAsObject) {
          return '';
        }

        return Object.entries(propertiesAsObject)
          .map(([name, value]) => `${name}="${value}"`)
          .join(' ');
      },
      getUniqueColumnNames(
        model: DatabaseConfigModel | DatabaseConfigSingleton
      ) {
        const { columns } = model;
        const result: string[] = [];

        for (const [columnName, column] of columns) {
          if (column.unique) {
            result.push(columnName);
          }
        }

        return result;
      },
      getLocalizedColumnNames(
        model: DatabaseConfigModel | DatabaseConfigSingleton
      ) {
        const { columns } = model;
        const result: string[] = [];

        for (const [columnName, column] of columns) {
          if (column.translations) {
            result.push(columnName);
          }
        }

        return result;
      },
      getColumnToPropelAttributes(columnName: string, column: ColumnType) {
        const attributes = new Map<PropelColumnAttributes, string>([
          ['name', columnName],
          ['type', promColumnTypeToPropelType[column.type]],
          ['required', String(column.required)],

          ['prom.editable', String(column.editable)],
          ['prom.hide', String(column.hide)],
          ['prom.title', column.title],
          ['prom.type', column.type],
          ['prom.readonly', String(column.readonly)],
          ['prom.adminMetadata.isHidden', String(column.admin.isHidden)],
          [
            'prom.adminMetadata.editor.placement',
            column.admin.editor.placement,
          ],
          [
            'prom.adminMetadata.editor.width',
            String(column.admin.editor.width),
          ],
        ]);

        switch (column.type) {
          case 'enum':
            attributes.set('valueSet', column.enum.join(','));
            break;

          case 'number':
            attributes.set(
              'autoIncrement',
              String(column.autoIncrement ?? false)
            );
            break;

          case 'relationship':
            attributes.set(
              'prom.labelConstructor',
              String(column.labelConstructor)
            );
            break;
        }

        if ('default' in column && column.default !== undefined) {
          attributes.set('defaultValue', String(column.default));
        }

        if (column.primaryKey !== undefined) {
          attributes.set('primaryKey', String(column.primaryKey));
        }

        return Object.fromEntries(attributes.entries());
      },
      getModelToPropelTableAttributes(
        modelName: string,
        model: DatabaseConfigModel | DatabaseConfigSingleton
      ) {
        const attributes = new Map<PropelTableAttributes, string>([
          ['name', getTableNameForModel(modelName, model)!],
          ['phpName', capitalizeFirstLetter(modelName, false)],
          ['prom.ignoreSeeding', String(model.ignoreSeeding)],
          ['prom.title', model.title ?? ''],
          ['prom.preset', model.preset ?? ''],
          ['prom.adminMetadata.icon', model.icon],
        ]);

        return Object.fromEntries(attributes.entries());
      },
      getTableNameForModel,
    },
  });

  // TODO: run vendor/bin/propel model:build after schema is created, but make sure that its installed first
};

export default generateModels;
