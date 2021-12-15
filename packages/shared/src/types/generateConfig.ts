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
};

export interface DatabaseConfig {
  models: Record<
    string,
    {
      columns: Record<
        string,
        ColumnSettingsBase &
          (
            | { type: 'enum'; enum: string[] }
            | { type: 'number'; autoIncrement?: boolean }
            | { type: 'string' | 'boolean' | 'date' }
          )
      >;
    }
  >;
}

export interface ExportConfig {
  database: DatabaseConfig;
}
