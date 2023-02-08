import { DAYS_IN_WEEK } from '@components/FieldMapper/fields/json/OpeningHours';
import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/shared';

/**
 * Takes care of special fields that need special default values to be working
 */
export const constructDefaultFormValues = (
  singleton: ApiResultModel | ApiResultModelSingleton
) => {
  const result = {};

  for (const [columnKey, columnInfo] of singleton.columns) {
    if (columnInfo.type == 'json') {
      if (columnInfo.admin.fieldType === 'openingHours') {
        result[columnKey] = {
          data: Object.fromEntries(DAYS_IN_WEEK.map((value) => [value, false])),
        };
      } else if (columnInfo.admin.fieldType === 'repeater') {
        result[columnKey] = {
          data: [],
        };
      }
    }
  }

  return result;
};
