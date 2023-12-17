import { promColumnTypeToPropelType } from '@constants';
import {
  PropelColumnAttributes,
  PropelDatabaseAttributes,
  PropelTableAttributes,
} from '@custom-types';
import { generateByTemplates, getModuleFolderName } from '@utils';
import camelCase from 'lodash/camelCase.js';
import upperFirst from 'lodash/upperFirst.js';
import path from 'path';

import {
  ColumnType,
  DatabaseConfigModel,
  DatabaseConfigSingleton,
  GeneratorConfig,
} from '@prom-cms/schema';

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

export type CreatePropelConfigOptions = {
  config: GeneratorConfig;
  appRoot: string;
};

export async function createPropelConfig({
  config,
  appRoot,
}: CreatePropelConfigOptions) {
  const isModelSingleton = (
    model: DatabaseConfigModel | DatabaseConfigSingleton
  ) => {
    const { singletons } = config.database;
    return (
      singletons &&
      singletons.find((singleton) => singleton.tableName === model.tableName)
    );
  };
  const projectNameAsFolderName = getModuleFolderName(config.project.name);

  const getTableNameForModel = (
    currentModel: DatabaseConfigModel | DatabaseConfigSingleton
  ) => {
    if (isModelSingleton(currentModel)) {
      return `singleton_${currentModel.tableName}`;
    }

    return currentModel.tableName;
  };

  for (const model of [
    ...(config.database.models ?? []),
    ...(config.database.singletons ?? []),
  ]) {
    for (const column of model.columns) {
      if (column.type === 'slug') {
        const columnOf = model.columns.find(
          (currentColumn) => currentColumn.name === column.of
        );

        if (!columnOf || columnOf.type !== 'string') {
          continue;
        }

        columnOf.primaryString = true;
      }
    }
  }

  // Module
  await generateByTemplates('parts.create-propel-config', appRoot, {
    '*': {
      projectNameAsFolderName,
      path,
      config: {
        ...config,
        project: {
          ...config.project,
          root: appRoot,
        },
      },
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

        for (const column of columns) {
          if (column.unique) {
            result.push(column.name);
          }
        }

        return result;
      },
      getLocalizedColumnNames(
        model: DatabaseConfigModel | DatabaseConfigSingleton
      ) {
        const { columns } = model;
        const result: string[] = [];

        for (const column of columns) {
          if (column.localized) {
            result.push(column.name);
          }
        }

        return result;
      },
      getDatabasePropelAttributes(): PropelDatabaseAttributes {
        return {
          name: config.database.connections.at(0)!.name,
          defaultIdMethod: 'native',
          namespace: `PromCMS\\Modules\\${projectNameAsFolderName}\\Models`,
        };
      },
      getColumnToPropelAttributes(column: ColumnType) {
        const attributes = new Map<PropelColumnAttributes, string>([
          ['name', column.name],
          ['type', promColumnTypeToPropelType[column.type]],
          ['required', String(column.required)],

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
        model: DatabaseConfigModel | DatabaseConfigSingleton
      ) {
        const attributes = new Map<PropelTableAttributes, string>([
          ['name', getTableNameForModel(model)!],
          ['phpName', upperFirst(camelCase(model.tableName))],
          ['prom.ignoreSeeding', String(model.ignoreSeeding)],
          ['prom.title', model.title ?? ''],
          ['prom.preset', model.preset ?? ''],
          ['prom.adminMetadata.icon', model.admin.icon],
          ['prom.adminMetadata.hidden', String(model.admin.hidden)],
        ]);

        return Object.fromEntries(attributes.entries());
      },
      getTableNameForModel,
    },
  });
}

export default createPropelConfig;
