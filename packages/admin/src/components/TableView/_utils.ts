import { DatabaseConfigModel } from '@prom-cms/schema';
import { TableViewCol } from './TableView';

export const formatApiModelResultToTableView = (
  model: DatabaseConfigModel
): TableViewCol[] =>
  [...model.columns].map(([columnKey, columnInfo]) => ({
    ...columnInfo,
    fieldName: columnKey,
    title: columnInfo.title,
    show: !(
      columnInfo.hide ||
      columnInfo.type === 'slug' ||
      columnInfo.admin?.isHidden ||
      false
    ),
  }));
