import { z } from 'zod';

export const columnTypeBaseSchema = z.object({
  /**
   * Human readable title. Defaults to the column key of this object
   * @default string {keyOfThisObject}
   */
  title: z.string(),

  /**
   * Decides if column should be visible in api response and returned from eloquent.
   * @default false
   */
  hide: z.boolean().default(false).optional(),

  /**
   * Decides if column should be required or not
   * @default false
   */
  required: z.boolean().default(false).optional(),

  /**
   * Determines if column should be unique across table
   * @default false
   */
  unique: z.boolean().default(false).optional(),

  /**
   * Determines if column should be editable.
   * @default true
   */
  editable: z.boolean().default(true).optional(),

  /**
   * If current field can be translated
   * @default true;
   */
  translations: z.boolean().default(true).optional(),

  /**
   * If column is hidden in admin ui
   */
  adminHidden: z.boolean().default(false).optional(),
});

export type ColumnTypeBase = z.infer<typeof columnTypeBaseSchema>;