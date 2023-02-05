import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import useCurrentModel from '@hooks/useCurrentModel';
import { ColumnType, FieldPlacements } from '@prom-cms/shared';
import { useMemo } from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const PostLikeFields: FC = () => {
  const { t } = useTranslation();
  const currentModel = useCurrentModel();

  const groupedFields = useMemo<
    Array<ColumnType & { columnName: string }>[] | undefined
  >(() => {
    if (!currentModel) return;

    const { title, content, ...columns } = currentModel.columns;

    return prepareFieldsForMapper(
      { ...currentModel, columns },
      FieldPlacements.ASIDE
    );
  }, [currentModel]);

  if (!(groupedFields && groupedFields.length)) {
    return null;
  }

  return (
    <AsideItemWrap title={t('Other info')}>
      <div className="grid gap-5 p-4">
        <FieldMapper type={FieldPlacements.ASIDE} fields={groupedFields} />
      </div>
    </AsideItemWrap>
  );
};
