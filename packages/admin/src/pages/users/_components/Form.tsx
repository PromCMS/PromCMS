import { useMemo, VFC } from 'react';
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import unset from 'lodash/unset';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useData } from '../_context';
import { FieldPlacements } from '@prom-cms/schema';

export const UserUnderpageForm: VFC = () => {
  const { model } = useData();
  const currentUser = useCurrentUser();

  const groupedFields = useMemo(() => {
    if (!model) return;
    const newModel = { ...model, columns: new Map(model.columns) };

    if (
      newModel.columns.has('role') &&
      !currentUser?.can({ action: 'update', targetModel: 'users' })
    ) {
      unset(newModel, 'columns.role');
    }

    return prepareFieldsForMapper(newModel, FieldPlacements.MAIN);
  }, [model, currentUser]);

  return groupedFields ? (
    <FieldMapper
      className="-mx-2"
      type={FieldPlacements.MAIN}
      fields={groupedFields}
    />
  ) : null;
};
