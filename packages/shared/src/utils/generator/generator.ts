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
        enum: ['Admin', 'Maintainer', 'Editor'],
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

    model.columns = {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        autoIncrement: true,
      },
      permissions: {
        title: 'permissions',
        editable: false,
        type: 'json',
      },
      // Iterate over all of columns that user provided
      ...Object.keys(model.columns).reduce((finalColumns, currentColumnKey) => {
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
      }, {} as typeof model.columns),
    };
  });

  return { ...config, database: { ...databaseConfig, models } };
};
