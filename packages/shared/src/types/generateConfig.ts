import { iconSet } from '@prom-cms/icons';

/**
 * PROM predefines some models
 */
export type PredefinedModelKeys = 'users' | 'userRoles' | 'files';

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
   * Target column name. Target column must be of type string.
   */
  of: string;
};

export type RelationshipColumnType = ColumnSettingsBase & {
  type: 'relationship';

  /**
   * Specify target model
   */
  targetModel: string;

  // TODO -- in the future we want some logic behind this to collect multiple keys and attach them in multiple string
  /**
   *
   */
  labelConstructor: string;

  /**
   * If we target many entries
   *
   * @default boolean false
   */
  multiple?: boolean;

  /**
   * Specifies that the column will be filled with data if has connection to real target
   *
   * @default boolean true
   */
  fill?: boolean;

  /**
   * Specify a field name that the target model has to hook on to
   *
   * @default string 'id'
   */
  foreignKey?: string;
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
  | FileColumnType
  | RelationshipColumnType;

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
   * If user can share its entry and define permissions for other users to access
   * @default true
   */
  sharable?: boolean;
  /**
   * Determines if every entry should keep info about who changed|created entry
   * @default true
   */
  ownable?: boolean;
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

export type SecurityOptionOptions = 'allow-everything' | 'allow-own' | false;

/**
 * Roles for each model by crud logic
 */
export interface ProjectSecurityRoleModelPermission {
  /**
   * Create
   * @default false;
   */
  c?: SecurityOptionOptions;

  /**
   * Read
   * @default false;
   */
  r?: SecurityOptionOptions;

  /**
   * Update
   * @default false;
   */
  u?: SecurityOptionOptions;

  /**
   * Delete
   * @default false;
   */
  d?: SecurityOptionOptions;
}

export type ModelUserPermissions = Record<
  PredefinedModelKeys | string,
  ProjectSecurityRoleModelPermission
>;

export interface ProjectSecurityRole {
  /**
   * Role name
   */
  name: string;

  /**
   * Model permissions
   */
  modelPermissions: ModelUserPermissions;

  /**
   * If user can use admin - this does not mean user cant log in
   *
   * @default true
   */
  hasAccessToAdmin?: boolean;
}

export interface ProjectSecurityConfig {
  secret?: string;
  /**
   * Project security roles
   */
  roles?: ProjectSecurityRole[];
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
