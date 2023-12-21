import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { FC, useMemo } from 'react';
import { useFormState } from 'react-hook-form';

import { FieldPlacements } from '@prom-cms/schema';

import { useData } from '../_context';

export const UserUnderpageForm: FC = () => {
  const { model } = useData();
  const currentUser = useCurrentUser();
  const formState = useFormState();

  const groupedFields = useMemo(() => {
    if (!model) return;
    const roleColumnIndex = model.columns.findIndex(
      (column) => column.name === 'role'
    );

    if (
      roleColumnIndex > -1 &&
      !currentUser?.can({ action: 'update', targetModel: 'users' })
    ) {
      model.columns = model.columns.splice(roleColumnIndex, 1);
    }

    return prepareFieldsForMapper(model, FieldPlacements.MAIN);
  }, [model, currentUser]);

  return (
    <>
      {groupedFields ? (
        <FieldMapper
          className="-mx-2"
          type={FieldPlacements.MAIN}
          fields={groupedFields}
        />
      ) : null}

      {formState.isSubmitting ? (
        <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
      ) : null}
    </>
  );
};
