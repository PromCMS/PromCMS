import { yupResolver } from '@hookform/resolvers/yup';
import { createUserSchema, updateUserSchema } from '@schemas';
import { FC, PropsWithChildren, useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { UserUnderpageForm } from './Form';
import { Header } from './Header';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import UnderPageBreadcrumbsMenu from '@components/UnderPageBreadcrumbsMenu';
import Skeleton from '@components/Skeleton';
import { FormAside } from './FormAside';
import { useOnSubmitCallback } from '../_hooks';
import { useTranslation } from 'react-i18next';
import { useData } from '../_context';

const FormWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { handleSubmit } = useFormContext();
  const onSubmitCallback = useOnSubmitCallback();

  return (
    <form onSubmit={handleSubmit(onSubmitCallback)} autoComplete="off">
      {children}
    </form>
  );
};

export const Content: FC = () => {
  const { user, model, isLoading, view } = useData();
  const { t } = useTranslation();

  const formMethods = useForm({
    defaultValues: user || {},
    reValidateMode: 'onBlur',
    mode: 'onTouched',
    resolver:
      view === 'create'
        ? yupResolver(createUserSchema)
        : yupResolver(updateUserSchema),
  });
  const { reset } = formMethods;

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  return (
    <FormProvider {...formMethods}>
      <FormWrapper>
        <UnderPageBreadcrumbsMenu
          className="py-5"
          items={[
            {
              content: t(capitalizeFirstLetter(model?.tableName || '')),
              isLinkTo: `/${model?.tableName?.toLowerCase()}`,
            },
            { content: t(view == 'update' ? 'Update' : 'Create') as string },
            ...(view === 'update'
              ? [
                  {
                    content: isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      <p className="text-green-500 underline">
                        {view == 'update' ? user?.id : 'Send invite'}
                      </p>
                    ),
                  },
                ]
              : []),
          ]}
        />
        <div className="mt-10 items-start justify-between xl:flex">
          <div className="relative -mx-3 grid w-full max-w-4xl gap-5 px-3">
            <Header />
            <UserUnderpageForm />
          </div>
          <FormAside />
        </div>
      </FormWrapper>
    </FormProvider>
  );
};
