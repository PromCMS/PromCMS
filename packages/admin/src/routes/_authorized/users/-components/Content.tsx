import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import { BASE_PROM_ENTITY_TABLE_NAMES } from '@constants';
import { useAuth } from '@contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageLayout } from '@layouts/PageLayout';
import { createUserSchema, updateUserSchema } from '@schemas';
import { canUser } from '@utils';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import { FieldPlacements } from '@prom-cms/schema';

import { useData } from '../-context';
import { useOnSubmitCallback } from '../-hooks';
import { useCurrentUser } from '../-hooks/useCurrentUser';
import { FormAside } from './FormAside';
import { Header } from './Header';

const FormWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { handleSubmit } = useFormContext();
  const onSubmitCallback = useOnSubmitCallback();

  return (
    <form
      onSubmit={handleSubmit(onSubmitCallback)}
      autoComplete="off"
      className="h-full"
    >
      {children}
    </form>
  );
};

export const Content: FC = () => {
  const { view } = useData();
  const { model } = useData();
  const { data: currentUser } = useCurrentUser();
  const { user: loggedUser } = useAuth();
  const formMethods = useForm({
    defaultValues: currentUser || {},
    reValidateMode: 'onBlur',
    mode: 'onTouched',
    resolver:
      view === 'create'
        ? zodResolver(createUserSchema)
        : zodResolver(updateUserSchema),
  });
  const { reset, formState } = formMethods;

  const groupedFields = useMemo(() => {
    if (!model) return;
    const roleColumnIndex = model.columns.findIndex(
      (column) => column.name === 'role'
    );

    if (
      roleColumnIndex > -1 &&
      loggedUser &&
      !canUser({
        userRole: loggedUser.role,
        action: 'update',
        targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.USERS,
      })
    ) {
      model.columns = model.columns.splice(roleColumnIndex, 1);
    }

    return prepareFieldsForMapper(model, FieldPlacements.MAIN);
  }, [model, currentUser]);

  useEffect(() => {
    if (currentUser) {
      reset(currentUser);
    }
  }, [currentUser, reset]);

  return (
    <FormProvider {...formMethods}>
      <FormWrapper>
        <PageLayout rightAsideOutlet={view === 'update' ? <FormAside /> : null}>
          <PageLayout.Header>
            <Header />
          </PageLayout.Header>
          <PageLayout.Content>
            {groupedFields ? (
              <FieldMapper type={FieldPlacements.MAIN} fields={groupedFields} />
            ) : null}

            {formState.isSubmitting ? (
              <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
            ) : null}
          </PageLayout.Content>
        </PageLayout>
      </FormWrapper>
    </FormProvider>
  );
};
