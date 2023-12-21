import { DatabaseConfigModel } from '@prom-cms/schema';

import { TableViewCol } from './TableView';

export const formatApiModelResultToTableView = (
  model: DatabaseConfigModel
): TableViewCol[] =>
  [...model.columns].map((columnInfo) => ({
    ...columnInfo,
    fieldName: columnInfo.name,
    title: columnInfo.title,
    show: !(
      columnInfo.hide ||
      columnInfo.type === 'slug' ||
      columnInfo.admin?.isHidden ||
      false
    ),
  }));
