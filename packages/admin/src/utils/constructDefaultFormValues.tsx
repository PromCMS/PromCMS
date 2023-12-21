import { DAYS_IN_WEEK } from '@components/FieldMapper/fields/json/OpeningHours';
import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/api-client';

/**
 * Takes care of special fields that need special default values to be working
 */
export const constructDefaultFormValues = <T extends Record<string, any>>(
  singleton: ApiResultModel | ApiResultModelSingleton,
  originalData: T
) => {
  const result = originalData;

  for (const columnInfo of singleton.columns) {
    const value = result[columnInfo.name];

    if (columnInfo.type == 'json' && !value) {
      if (columnInfo.admin.fieldType === 'openingHours') {
        (result as any)[columnInfo.name] = {
          data: Object.fromEntries(DAYS_IN_WEEK.map((value) => [value, false])),
        };
      } else if (columnInfo.admin.fieldType === 'repeater') {
        (result as any)[columnInfo.name as any] = {
          data: [],
        };
      }
    }
  }

  return result;
};
