import { AvatarSelect } from '@components/AvatarSelect';
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
    mode: 'onBlur',
    resolver:
      view === 'create'
        ? zodResolver(createUserSchema)
        : zodResolver(updateUserSchema),
  });
  const { reset, formState } = formMethods;

  const allFieldsExpectAvatar = useMemo(() => {
    if (!model) return [];
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

    const allFields = prepareFieldsForMapper(model, FieldPlacements.MAIN);
    const avatarColumnIndex = allFields.findIndex(
      (item) => item.name === 'avatar'
    );

    if (avatarColumnIndex > -1) {
      allFields.splice(avatarColumnIndex, 1);
    }

    return allFields;
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
            <div className="mt-6 w-full gap-8 pb-5 flex flex-col items-baseline md:flex-row h-full">
              <AvatarSelect user={currentUser ?? null} />
              <div className="flex flex-col gap-3 w-full">
                {allFieldsExpectAvatar ? (
                  <FieldMapper
                    type={FieldPlacements.MAIN}
                    fields={allFieldsExpectAvatar}
                  />
                ) : null}
              </div>
            </div>

            {formState.isSubmitting ? (
              <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
            ) : null}
          </PageLayout.Content>
        </PageLayout>
      </FormWrapper>
    </FormProvider>
  );
};
