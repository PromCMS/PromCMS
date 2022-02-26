import { iconSet } from '../icons';

type ColumnSettingsBase = {
  /**
   * Human readable title. Defaults to the column key of this object
   * @default string {keyOfThisObject}
   */
  title: string;
  /**
   * Decides if column should be visible in api response and returned from eloquent.
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
  /**
   * Determines if column should be editable.
   * @default true
   */
  editable?: boolean;
};

export type ModelColumnType = ColumnSettingsBase &
  (
    | { type: 'enum'; enum: string[] }
    | { type: 'number'; autoIncrement?: boolean }
    | { type: 'string' | 'boolean' | 'date' | 'password' | 'dateTime' }
  );

export type ModelColumnName = string;
export type DatabaseTableName = string;

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
  columns: Record<ModelColumnName, ModelColumnType>;
  /**
   * If seeding process should be omitted for this model
   * @defaultValue false
   */
  ignoreSeeding?: boolean;
}

export interface DatabaseConfig {
  models: Record<DatabaseTableName, DatabaseConfigModel>;
}

export interface ExportConfig {
  database: DatabaseConfig;
}

export default {};
