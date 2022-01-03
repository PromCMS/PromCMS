import { iconSet } from '../icons';

export interface DatabaseConfigModel {
  /**
   * Generated icon for this model, is visible in admin
   */
  icon: keyof typeof iconSet;
  /**
   * If generated table should have timestamps
   */
  timestamp?: boolean;
  /**
   * Custom table name to model
   * @default string Key of this object
   */
  tableName?: string;
  /**
   * If generated table have entries with soft-delete
   */
  softDelete?: boolean;
  /**
   * Table columns
   */
  columns: Record<
    string,
    ColumnSettingsBase &
      (
        | { type: 'enum'; enum: string[] }
        | { type: 'number'; autoIncrement?: boolean }
        | { type: 'string' | 'boolean' | 'date' | 'password' | 'dateTime' }
      )
  >;
}

export interface DatabaseConfig {
  models: Record<string, DatabaseConfigModel>;
}

type ColumnSettingsBase = {
  /**
   * Decides if column should be visible in api response
   * @default false
   */
  hide?: boolean;
  /**
   * Decides if column should be required or not
   * @default true
   */
  required?: boolean;
  /**
   * Determines if column should be unique across table
   * @default false
   */
  unique?: boolean;
};

export interface ExportConfig {
  database: DatabaseConfig;
}

export default {};