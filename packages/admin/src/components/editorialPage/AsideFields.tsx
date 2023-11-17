import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import { ColumnType, FieldPlacements } from '@prom-cms/schema';
import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/shared';
import { useMemo } from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const AsideFields: FC<{
  model: ApiResultModel | ApiResultModelSingleton;
}> = ({ model }) => {
  const { t } = useTranslation();

  const groupedFields = useMemo<
    Array<ColumnType & { columnName: string }> | undefined
  >(() => {
    if (!model) return;

    return prepareFieldsForMapper(model, FieldPlacements.ASIDE);
  }, [model]);

  if (!(groupedFields && groupedFields.length)) {
    return null;
  }

  return (
    <AsideItemWrap title={t('Other info')}>
      <FieldMapper
        className="mb-10 p-3 "
        type={FieldPlacements.ASIDE}
        fields={groupedFields}
      />
    </AsideItemWrap>
  );
};
