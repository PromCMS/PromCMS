import { GeneratorConfig } from '../types';
import { validateGeneratorConfig } from './validateGeneratorConfig';
import kebabCase from 'lodash.kebabcase';

export const formatGeneratorConfig = async (
  config: GeneratorConfig
): Promise<GeneratorConfig> => {
  if (!config) throw 'No config provided to "formatGeneratorConfig" function';

  let {
    database: { models },
    database: databaseConfig,
  } = config;

  Object.keys(models).forEach((modelKey) => {
    const model = models[modelKey];

    if (model.admin?.layout === 'post-like') {
      const {
        title: unsetTitle,
        content: unsetContent,
        ...restColumns
      } = model.columns;
      model.columns = {
        title: {
          title: 'Title',
          type: 'string',
          unique: true,
          required: true,
        },
        content: {
          title: 'Content',
          type: 'json',
          default: '{}',
        },
        slug: {
          title: 'Zkratka',
          type: 'slug',
          of: 'title',
          editable: false,
        },
        ...restColumns,
      };
    }

    if (model.draftable) {
      model.columns.is_published = {
        title: 'Is published',
        type: 'boolean',
        unique: false,
        translations: false,
      };
    }

    if (model.sorting) {
      model.columns.order = {
        title: 'Order',
        type: 'number',
        unique: false,
        autoIncrement: true,
        editable: false,
        adminHidden: true,
        translations: false,
      };
    }

    if (model.sharable || model.sharable === undefined) {
      model.columns.coeditors = {
        title: 'Coeditors',
        type: 'json',
        default: '{}',
        translations: false,
      };
    }

    if (model.ownable || model.ownable === undefined) {
      model.columns.created_by = {
        title: 'Created by',
        editable: false,
        type: 'relationship',
        targetModel: 'user',
        labelConstructor: 'name',
        fill: false,
        adminHidden: true,
        translations: false,
      };

      model.columns.updated_by = {
        title: 'Updated by',
        editable: false,
        type: 'relationship',
        targetModel: 'user',
        labelConstructor: 'name',
        fill: false,
        adminHidden: true,
        translations: false,
      };
    }

    model.columns = {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        autoIncrement: true,
        unique: true,
        translations: false,
      },
      ...model.columns,
    };

    // Iterate over all of columns that user provided
    model.columns = Object.keys(model.columns).reduce(
      (finalColumns, currentColumnKey) => {
        const column = model.columns[currentColumnKey];

        // set default values
        return {
          ...finalColumns,
          [currentColumnKey]: {
            required: false,
            editable: true,
            unique: false,
            hide: false,
            translations: true,
            ...(column.type === 'number' ? { autoIncrement: false } : {}),
            ...(column.type === 'slug' ? { unique: true } : {}),
            ...(column.type === 'relationship'
              ? { multiple: false, foreignKey: 'id', fill: true }
              : {}),
            ...column,
          },
        };
      },
      {} as typeof model.columns
    );

    models[modelKey] = {
      softDelete: false,
      timestamp: false,
      sorting: false,
      sharable: true,
      draftable: false,
      ignoreSeeding: false,
      ownable: true,
      intl: true,
      ...model,
      tableName: model.tableName ?? kebabCase(modelKey),
    };
  });

  const roles = config.project.security?.roles;

  if (roles) {
    // Set default values of roles
    config.project.security = {
      roles: roles.map(({ modelPermissions, ...rest }) => {
        const updatedPerms = Object.entries(modelPermissions).map(
          ([key, values]) => [
            key,
            {
              c: 0,
              r: 0,
              u: 0,
              d: 0,
              ...values,
            },
          ]
        );

        return {
          hasAccessToAdmin: true,
          ...rest,
          modelPermissions: Object.fromEntries(updatedPerms),
        };
      }),
    };
  }

  const result = { ...config, database: { ...databaseConfig, models } };

  return validateGeneratorConfig(result);
};
