import { ExportConfig } from '../types';
import { GENERATOR_CONFIG } from '../constants';

// TODO: Create generator config validator

export const isGeneratorConfigProvided = !!GENERATOR_CONFIG;

export const formatGeneratorConfig = (config: ExportConfig): ExportConfig => {
  if (!config) throw 'No config provided to "formatGeneratorConfig" function';
  let {
    database: { models },
    database: databaseConfig,
  } = config;

  // we need to make sure that we at least have default columns
  models['users'] = {
    icon: 'UserGroupIcon',
    columns: {
      ...((models['users'] || {}).columns || {}),
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
      role: {
        title: 'Role',
        type: 'enum',
        enum: ['Admin', 'Anonymous'],
      },
    },
  };

  Object.keys(models).forEach((modelKey) => {
    const model = models[modelKey];

    model.columns = {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        autoIncrement: true,
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
            ...column,
          },
        };
      }, {} as typeof model.columns),
    };
  });

  return { ...config, database: { ...databaseConfig, models } };
};
