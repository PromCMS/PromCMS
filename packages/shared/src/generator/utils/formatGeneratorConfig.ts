import kebabCase from 'lodash.kebabcase';
import { FieldPlacements } from '../../index.js';
import { GeneratorConfigInput } from '../../types/GeneratorConfig.js';

const simplifyProjectName = (name: string) =>
  name.replaceAll(' ', '-').toLocaleLowerCase();

export const formatGeneratorConfig = async (config: GeneratorConfigInput) => {
  if (!config) throw 'No config provided to "formatGeneratorConfig" function';

  let {
    database: { models, singletons },
    database: databaseConfig,
  } = config;

  // FIXME: Singleton overrides models
  const allModels = { ...models, ...singletons };

  Object.entries(allModels).forEach(([modelKey, model]) => {
    const isSingleton = singletons && modelKey in singletons;

    if (model.preset === 'post') {
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
          admin: {
            fieldType: 'heading',
            editor: {
              placement: FieldPlacements.ASIDE,
            },
          },
        },
        content: {
          title: 'Content',
          type: 'json',
          default: '{}',
          admin: {
            fieldType: 'blockEditor',
            editor: {
              placement: FieldPlacements.MAIN,
            },
          },
        },
        slug: {
          title: 'Slug',
          type: 'slug',
          of: 'title',
          editable: false,
        },
        ...restColumns,
      };
    }

    if ('draftable' in model && model.draftable) {
      model.columns.is_published = {
        title: 'Is published',
        type: 'boolean',
        unique: false,
        translations: false,
      };
    }

    if ('sorting' in model && model.sorting) {
      model.columns.order = {
        title: 'Order',
        type: 'number',
        unique: false,
        autoIncrement: true,
        editable: false,
        translations: false,
        admin: {
          isHidden: true,
        },
      };
    }

    if (
      'sharable' in model &&
      (model.sharable || model.sharable === undefined)
    ) {
      model.columns.coeditors = {
        title: 'Coeditors',
        type: 'json',
        default: '{}',
        translations: false,
      };
    }

    if ('ownable' in model && (model.ownable || model.ownable === undefined)) {
      model.columns.created_by = {
        title: 'Created by',
        editable: false,
        type: 'relationship',
        targetModel: 'user',
        labelConstructor: 'name',
        fill: false,
        translations: false,
        admin: {
          isHidden: true,
        },
      };

      model.columns.updated_by = {
        title: 'Updated by',
        editable: false,
        type: 'relationship',
        targetModel: 'user',
        labelConstructor: 'name',
        fill: false,
        translations: false,
        admin: {
          isHidden: true,
        },
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

    (isSingleton ? singletons! : models)[modelKey] = {
      softDelete: false,
      timestamp: false,
      sorting: false,
      sharable: true,
      draftable: false,
      ignoreSeeding: false,
      ownable: true,
      intl: true,
      ...model,
      ...(isSingleton
        ? { name: 'name' in model ? model.name : kebabCase(modelKey) }
        : {
            tableName:
              'tableName' in model ? model.tableName : kebabCase(modelKey),
          }),
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

  return {
    ...config,
    database: { ...databaseConfig, models, singletons },
    project: {
      slug: simplifyProjectName(config.project.name || ''),
      ...config.project,
    },
  };
};
