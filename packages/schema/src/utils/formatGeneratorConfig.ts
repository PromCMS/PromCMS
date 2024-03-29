import isString from 'lodash/isString.js';
import slugify from 'slugify';

import { FieldPlacements } from '../columnType/columnTypeBaseAdminConfigSchema.js';
import { GeneratorConfigInput } from '../generatorConfigSchema.js';
import { SecurityOptionOptions } from '../projectSecurityRoleModelPermissionSchema.js';
import { nameToPhpClassName } from './nameToPhpClassName.js';

export const formatGeneratorConfig = async (config: GeneratorConfigInput) => {
  if (!config) throw 'No config provided to "formatGeneratorConfig" function';

  let {
    database: { models = [], singletons = [] },
    database: databaseConfig,
  } = config;

  const allModels = [...models, ...singletons];

  for (const model of allModels) {
    const isDraftable = 'draftable' in model;
    const isSortable = 'sorting' in model;
    const isSharable = 'sharable' in model;
    const isOwnable = 'ownable' in model;

    const singletonColumns = [
      ...(model.preset === 'post' ? ['title', 'content'] : []),
    ];

    for (const singletonColumn of singletonColumns) {
      const existingIndex = model.columns.findIndex(
        (column) => column.name === singletonColumn
      );
      if (existingIndex > -1) {
        console.warn(
          `Defined column "${singletonColumn}" will be overriden since its reserved column which you cannot override`
        );

        model.columns.splice(existingIndex, 1);
      }
    }

    if (model.preset === 'post') {
      model.columns.unshift(
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          unique: true,
          required: true,
          localized: true,
          admin: {
            fieldType: 'heading',
            editor: {
              placement: FieldPlacements.MAIN,
            },
          },
        },
        {
          name: 'content',
          title: 'Content',
          type: 'json',
          defaultValue: '[]',
          localized: true,
          admin: {
            fieldType: 'blockEditor',
            editor: {
              placement: FieldPlacements.MAIN,
            },
          },
        },
        {
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          of: 'title',
          localized: true,
          readonly: true,
        }
      );
    }

    // if (isDraftable) {
    //   model.columns.push({
    //     name: 'is_published',
    //     title: 'Is published',
    //     type: 'boolean',
    //     unique: false,
    //   });
    // }

    // if (isSortable) {
    //   model.columns.push({
    //     name: 'order',
    //     title: 'Order',
    //     type: 'number',
    //     unique: false,
    //     autoIncrement: true,
    //     required: false,
    //     readonly: true,
    //     admin: {
    //       isHidden: true,
    //     },
    //   });
    // }

    // if (isSharable) {
    //   model.columns.push({
    //     name: 'coeditors',
    //     title: 'Coeditors',
    //     type: 'json',
    //     defaultValue: '[]',
    //     required: false,
    //     admin: {
    //       fieldType: 'jsonEditor',
    //       isHidden: true,
    //     },
    //   });
    // }

    // if (isOwnable) {
    //   model.columns.push({
    //     name: 'created_by',
    //     title: 'Created by',
    //     readonly: true,
    //     type: 'relationship',
    //     targetModelTableName: 'user',
    //     labelConstructor: '{{name}}',
    //     required: false,
    //     admin: {
    //       isHidden: true,
    //     },
    //   });

    //   model.columns.push({
    //     name: 'updated_by',
    //     title: 'Updated by',
    //     readonly: true,
    //     type: 'relationship',
    //     targetModelTableName: 'user',
    //     labelConstructor: '{{name}}',
    //     required: false,
    //     admin: {
    //       isHidden: true,
    //     },
    //   });
    // }

    // Iterate over all of columns that user provided
    model.columns = model.columns.map((column) => ({
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
    }));

    // Set some model defaults if they are not already set

    model.timestamp ??= false;
    model.ignoreSeeding ??= false;

    if ('sorting' in model) {
      model.sorting ??= false;
    }

    if ('sharable' in model) {
      model.sharable ??= true;
    }

    if ('draftable' in model) {
      model.draftable ??= false;
    }

    if ('ownable' in model) {
      model.ownable ??= true;
    }
  }

  const roles = config.project.security?.roles;

  if (roles) {
    // Set default values of roles
    config.project.security = {
      roles: roles.map(({ modelPermissions, ...rest }) => {
        const updatedPerms = Object.entries(modelPermissions).map(
          ([key, values]) => [
            key,
            isString(values)
              ? values
              : {
                  c: SecurityOptionOptions.DISABLED,
                  r: SecurityOptionOptions.DISABLED,
                  u: SecurityOptionOptions.DISABLED,
                  d: SecurityOptionOptions.DISABLED,
                  ...values,
                },
          ]
        );

        return {
          hasAccessToAdmin: true,
          ...rest,
          slug:
            rest.slug ??
            slugify.default(rest.name, { lower: true, trim: true }),
          modelPermissions: Object.fromEntries(updatedPerms),
        };
      }),
    };
  }

  return {
    ...config,
    database: { ...databaseConfig, models, singletons },
    project: {
      slug: nameToPhpClassName(config.project.name || ''),
      ...config.project,
    },
  };
};
