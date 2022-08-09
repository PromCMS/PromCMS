import { ExportConfig } from '../../types';
import { GENERATOR_FILENAME } from '../../generator-constants';
import findConfig from 'find-config';

// TODO: Create generator config validator

export const findGeneratorConfig = (
  root?: string
): Promise<undefined | ExportConfig> =>
  findConfig.require(GENERATOR_FILENAME, {
    module: true,
    ...(root ? { cwd: root } : {}),
  });

export const formatGeneratorConfig = (config: ExportConfig): ExportConfig => {
  if (!config) throw 'No config provided to "formatGeneratorConfig" function';

  let {
    database: { models },
    database: databaseConfig,
  } = config;

  // Files are predefined and cannot be changed
  models['files'] = {
    icon: 'Folder',
    admin: {
      layout: 'simple',
    },
    tableName: 'files',
    timestamp: true,
    ignoreSeeding: true,
    sharable: false,
    intl: false,
    columns: {
      filename: {
        title: 'Filename',
        type: 'string',
        required: true,
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      filepath: {
        title: 'Filepath',
        type: 'string',
        editable: false,
        required: true,
        unique: true,
      },
      private: {
        title: 'Is private',
        type: 'boolean',
      },
      mimeType: {
        title: 'Mime type',
        editable: false,
        required: true,
        type: 'string',
      },
    },
  };

  models['settings'] = {
    admin: {
      layout: 'simple',
    },
    icon: 'Settings',
    columns: {
      name: {
        title: 'Name',
        type: 'string',
        required: true,
        unique: true,
        translations: false,
      },
      label: {
        title: 'Label',
        type: 'string',
        required: true,
      },
      content: {
        title: 'content',
        type: 'json',
        required: true,
        default: '{}',
      },
    },
  };

  models['userRoles'] = {
    admin: {
      layout: 'simple',
    },
    ownable: false,
    icon: 'UserExclamation',
    intl: false,
    columns: {
      label: {
        title: 'Label',
        type: 'string',
        required: true,
      },
      slug: {
        title: 'Slug',
        type: 'slug',
        of: 'label',
        editable: false,
      },
      description: {
        type: 'longText',
        title: 'Popisek',
      },
      permissions: {
        title: 'Permissions',
        type: 'json',
        default: '{}',
      },
    },
  };

  // we need to make sure that we at least have default columns
  models['users'] = {
    admin: {
      layout: 'simple',
    },
    sharable: false,
    ownable: false,
    icon: 'Users',
    intl: false,
    columns: {
      // TODO: Do not make these values overridable
      name: {
        title: 'Name',
        type: 'string',
        required: true,
      },
      password: {
        title: 'Password',
        type: 'password',
        required: true,
        hide: true,
      },
      email: {
        title: 'Email',
        type: 'string',
        required: true,
        unique: true,
      },
      avatar: {
        title: 'Avatar',
        type: 'string',
      },
      state: {
        title: 'State',
        type: 'enum',
        editable: false,
        required: true,
        enum: ['active', 'invited', 'blocked', 'password-reset'],
      },
      role: {
        type: 'relationship',
        targetModel: 'userRoles',
        title: 'Role',
        adminHidden: true,
        fill: false,
        required: true,
        labelConstructor: 'label',
      },
      ...((models['users'] || {}).columns || {}),
    },
  };

  Object.keys(models).forEach((modelKey) => {
    const model = models[modelKey];

    // Set default values
    model.admin = {
      layout: 'post-like',
      ...(model.admin || {}),
    };

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
      tableName: modelKey.toLocaleLowerCase(),
      intl: true,
      ...model,
    };
  });

  const roles = config.project.security?.roles;
  if (roles) {
    if (!config.project.security) {
      config.project.security = {};
    }

    // Set default values of roles
    config.project.security.roles = roles.map(
      ({ modelPermissions, ...rest }) => {
        const updatedPerms = Object.entries(modelPermissions).map(
          ([key, values]) => [
            key,
            {
              c: false,
              r: false,
              u: false,
              d: false,
              ...values,
            },
          ]
        );

        return {
          hasAccessToAdmin: true,
          ...rest,
          modelPermissions: Object.fromEntries(updatedPerms),
        };
      }
    );
  }

  return { ...config, database: { ...databaseConfig, models } };
};
