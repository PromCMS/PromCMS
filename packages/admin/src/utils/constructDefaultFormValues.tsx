import { DAYS_IN_WEEK } from '@components/FieldMapper/fields/json/OpeningHours';
import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/shared';

/**
 * Takes care of special fields that need special default values to be working
 */
export const constructDefaultFormValues = <T extends Record<string, any>>(
  singleton: ApiResultModel | ApiResultModelSingleton,
  originalData: T
) => {
  const result = originalData;

  for (const [columnKey, columnInfo] of singleton.columns) {
    const value = result[columnKey];
    if (columnInfo.type == 'json' && !value) {
      if (columnInfo.admin.fieldType === 'openingHours') {
        (result as any)[columnKey] = {
          data: Object.fromEntries(DAYS_IN_WEEK.map((value) => [value, false])),
        };
      } else if (columnInfo.admin.fieldType === 'repeater') {
        (result as any)[columnKey as any] = {
          data: [],
        };
      }
    }
  }

  return result;
};
