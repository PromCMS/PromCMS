import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { useMemo } from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/api-client';
import { ColumnType, FieldPlacements } from '@prom-cms/schema';

export const AsideFields: FC<{
  model: ApiResultModel | ApiResultModelSingleton;
}> = ({ model }) => {
  const { t } = useTranslation();

  const groupedFields = useMemo<ColumnType[] | undefined>(() => {
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
