import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { MESSAGES } from '@constants';
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
    <AsideItemWrap title={t(MESSAGES.OTHER_INFO)}>
      <div className="mb-5 flex flex-wrap gap-y-5 items-baseline p-2">
        <FieldMapper type={FieldPlacements.ASIDE} fields={groupedFields} />
      </div>
    </AsideItemWrap>
  );
};
