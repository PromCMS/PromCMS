import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import {
  ApiResultModel,
  ApiResultModelSingleton,
  ColumnType,
  FieldPlacements,
} from '@prom-cms/shared';
import { useMemo } from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const AsideFields: FC<{
  model: ApiResultModel | ApiResultModelSingleton;
}> = ({ model }) => {
  const { t } = useTranslation();

  const groupedFields = useMemo<
    Array<ColumnType & { columnName: string }>[] | undefined
  >(() => {
    if (!model) return;

    return prepareFieldsForMapper(model, FieldPlacements.ASIDE);
  }, [model]);

  if (!(groupedFields && groupedFields.length)) {
    return null;
  }

  console.log({ groupedFields });

  return (
    <AsideItemWrap title={t('Other info')}>
      <div className="grid gap-5 sm:gap-8 p-4  mb-10">
        <FieldMapper type={FieldPlacements.ASIDE} fields={groupedFields} />
      </div>
    </AsideItemWrap>
  );
};