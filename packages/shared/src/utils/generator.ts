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
        type: 'string',
        required: true,
      },
      password: {
        type: 'password',
        required: true,
        hide: true,
      },
      email: {
        type: 'string',
        required: true,
        unique: true,
      },
      avatar: {
        type: 'string',
      },
      role: {
        type: 'enum',
        enum: ['Admin', 'Anonymous'],
      },
    },
  };

  Object.keys(models).forEach((modelKey) => {
    const model = models[modelKey];

    model.columns = {
      id: {
        type: 'number',
        autoIncrement: true,
      },
      ...model.columns,
    };

    Object.keys(model.columns).forEach((columnKey) => {});
  });

  return { ...config, database: { ...databaseConfig, models } };
};
