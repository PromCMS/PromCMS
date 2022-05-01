import { iconSet } from '@prom-cms/icons';

export type ColumnSettingsBase = {
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
  /**
   * If column is hidden in admin ui
   */
  adminHidden?: boolean;
};

export type EnumColumnType = ColumnSettingsBase & {
  type: 'enum';
  enum: string[];
  default?: string;
};

export type NumberColumnType = ColumnSettingsBase & {
  type: 'number';
  autoIncrement?: boolean;
  default?: number;
};

export type SlugColumnType = ColumnSettingsBase & {
  type: 'slug';
  /**
   * TODO: Must be one of columns
   */
  of: string;
};

export type FileColumnType = ColumnSettingsBase & {
  // TODO add option to foreign - it has advantage
  // https://stackoverflow.com/questions/13541057/laravel-relationships-in-migrations
  type: 'file';

  /**
   * If user can select multiple files
   */
  multiple?: boolean;

  /**
   * MimeType type part filter
   */
  typeFilter?: string;
};

export type NormalColumnType = ColumnSettingsBase & {
  type:
    | 'string'
    | 'boolean'
    | 'date'
    | 'password'
    | 'dateTime'
    | 'longText'
    | 'json';
  /**
   * Set default value
   */
  default?: string;
};

export type ColumnType =
  | EnumColumnType
  | NumberColumnType
  | NormalColumnType
  | SlugColumnType
  | FileColumnType;

export type ModelColumnName = string;
export type DatabaseTableName = string;

export interface DatabaseConfigItemBase {
  /**
   * Generated icon for this model, is visible in admin
   */
  icon: keyof typeof iconSet;
  /**
   * If seeding process should be omitted for this model
   * @defaultValue false
   */
  ignoreSeeding?: boolean;
}

export interface DatabaseConfigModel extends DatabaseConfigItemBase {
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
   * Enable drafting of items
   */
  draftable?: boolean;
  /**
   * Enable sorting for entries by drag and drop
   */
  sorting?: boolean;
  /**
   * Enable permission system for entries
   *  @default true
   */
  permissions?: boolean;
  /**
   * Admin config
   */
  admin?: {
    /**
     * Indicates the resulted template for this model. "post-like" option generates default column "content" which is a block editor
     * @defaultValue post-like
     */
    layout?: 'simple' | 'post-like';
  };
  /**
   * Table columns
   */
  columns: Record<ModelColumnName, ColumnType>;
}

export interface DatabaseConfigSingleton extends DatabaseConfigItemBase {
  columns: Record<ModelColumnName, ColumnType>;
}

export interface DatabaseConfig {
  models: Record<DatabaseTableName, DatabaseConfigModel>;
}

export interface ProjectSecurityConfig {
  secret?: string;
}

export interface ProjectConfig {
  /**
   * A project name
   */
  name: string;
  /**
   * If final project will be hosted on different folder that in the root
   */
  prefix?: string;
  /**
   * Final project url
   */
  url: string;
  /**
   * Projects security config
   */
  security?: ProjectSecurityConfig;
}

export interface ExportConfig {
  project: ProjectConfig;
  database: DatabaseConfig;
}

export default {};
