import { ExportConfig } from '../../types';
import { GENERATOR_FILENAME } from '../../generator-constants';
import findConfig from 'find-config';

// TODO: Create generator config validator

export const getGeneratorConfig = (
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
    permissions: false,
    columns: {
      filename: {
        title: 'Filename',
        type: 'string',
        required: true,
      },
      description: {
        title: 'Description',
        type: 'string',
        required: false,
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
      },
    },
  };

  // we need to make sure that we at least have default columns
  models['users'] = {
    admin: {
      layout: 'simple',
    },
    permissions: false,
    icon: 'Users',
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
        required: false,
      },
      role: {
        title: 'Role',
        type: 'enum',
        enum: ['admin', 'maintainer', 'editor'],
        unique: false,
        required: true,
      },
      state: {
        title: 'State',
        type: 'enum',
        editable: false,
        enum: ['active', 'invited', 'blocked', 'password-reset'],
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
        },
        content: {
          title: 'Content',
          type: 'json',
        },
        slug: {
          title: 'Zkratka',
          type: 'slug',
          of: 'title',
          required: false,
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
        required: false,
      };
    }

    if (model.sorting) {
      model.columns.order = {
        title: 'Order',
        type: 'number',
        unique: false,
        autoIncrement: true,
        editable: false,
        required: false,
        adminHidden: true,
      };
    }

    if (model.permissions === undefined || model.permissions) {
      model.columns.permissions = {
        title: 'permissions',
        editable: false,
        required: false,
        type: 'json',
      };
    }

    model.columns = {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        autoIncrement: true,
        unique: true,
        required: false,
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
            required: true,
            editable: true,
            unique: false,
            hide: false,
            ...(column.type === 'number' ? { autoIncrement: false } : {}),
            ...(column.type === 'slug' ? { unique: true } : {}),
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
      permissions: true,
      draftable: false,
      tableName: modelKey.toLocaleLowerCase(),
      ...model,
    };
  });

  return { ...config, database: { ...databaseConfig, models } };
};
