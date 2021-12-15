export const getDatabaseConfig = async () => {
  const exportConfig = (await import('../../../../prom.generate-config.js'))
    .default;

  const {
    database: { models },
    database: databaseConfig,
  } = exportConfig;

  Object.keys(models).forEach((modelKey) => {
    const model = models[modelKey];

    model.columns['id'] = model.columns['id'] || {
      type: 'number',
      autoIncrement: true,
    };

    Object.keys(model.columns).forEach((columnKey) => {});
  });

  return databaseConfig;
};
