import { ExportConfig } from '@prom/shared';
import { Database } from 'better-sqlite3';

const clearDatabase = (
  db: Database,
  databaseConfig: ExportConfig['database']
) => {
  Object.keys(databaseConfig.models).forEach((modelKey) => {
    const model = databaseConfig.models[modelKey];
    const stmt = db.prepare(
      `DELETE FROM ${model.tableName || modelKey.toLowerCase()}`
    );
    stmt.run();
  });
};

export default clearDatabase;
