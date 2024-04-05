import { apiClient } from '@api';
import { MESSAGES } from '@constants';
import {
  Button,
  Divider,
  Paper,
  Switch,
  Text,
  TextInput,
  Textarea,
  useMantineTheme,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toastedPromise } from '@utils';
import dayjs from 'dayjs';
import { FC, useCallback, useRef } from 'react';
import {
  Controller,
  FormProvider,
  useController,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'tabler-icons-react';

import { ApiResultMaintanance } from '@prom-cms/api-client';

const minimumDateForMaintanance = dayjs().add(15, 'minutes').toDate();
const useMaintananceInfo = () =>
  useQuery({
    queryFn: async () =>
      await apiClient.settings.maintanance.get().then((value) => value.data),
    queryKey: ['maintanance'],
    suspense: true,
  });

const useToggleMaintanance = () =>
  useMutation({
    mutationFn: async (
      nextValue:
        | { enabled: false }
        | ({ enabled: true } & Omit<ApiResultMaintanance, 'enabled'>)
    ) => {
      if (nextValue.enabled) {
        await apiClient.settings.maintanance.enable(nextValue);
      } else {
        await apiClient.settings.maintanance.disable();
      }
    },
    mutationKey: ['maintanance-toggle'],
  });

export const MaintananceMode: FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { data } = useMaintananceInfo();
  const { mutateAsync: saveMaintanance } = useToggleMaintanance();
  const { t } = useTranslation();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const theme = useMantineTheme();
  const form = useForm<ApiResultMaintanance>({ defaultValues: data });
  const { register, control, formState, handleSubmit } = form;
  const fieldsAreDisabled = disabled || formState.isSubmitting;
  const { field: enabledField } = useController({ control, name: 'enabled' });
  const isMaintananceEnabled = !!enabledField.value;

  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    async (params) => {
      await toastedPromise(
        {
          title: t(MESSAGES.PLEASE_WAIT),
          message: t(MESSAGES.ITEM_UPDATE_WORKING),
          successMessage: t(MESSAGES.ITEM_UPDATE_DONE),
        },
        async () => {
          await saveMaintanance(params);
        }
      );
    },
    []
  );

  return (
    <FormProvider {...form}>
      <form autoComplete="false" onSubmit={handleSubmit(onSubmit)}>
        <Divider
          label={
            <Switch
              color="teal"
              size="sm"
              label={<Text size="xs">{t(MESSAGES.MAINTANANCE_MODE)}</Text>}
              classNames={{ track: !disabled ? '!cursor-pointer' : undefined }}
              disabled={fieldsAreDisabled}
              thumbIcon={
                isMaintananceEnabled ? (
                  <Check className="w-3 h-3" color={theme.colors.teal[6]} />
                ) : (
                  <X className="w-3 h-3" color={theme.colors.red[6]} />
                )
              }
              name={enabledField.name}
              checked={enabledField.value}
              onChange={(event) => {
                const nextValue = event.target.checked;
                enabledField.onChange(nextValue);
                submitButtonRef.current?.click();
              }}
              onBlur={enabledField.onBlur}
              ref={enabledField.ref}
            />
          }
          labelPosition="left"
          orientation="vertical"
          className="h-3 my-auto mt-8 mb-4"
        />
        <Paper className="mb-4 p-4">
          <TextInput
            label={t(MESSAGES.TITLE)}
            type="text"
            placeholder={t(MESSAGES.MAINTANANCE_TITLE_PLACEHOLDER)}
            className="w-full"
            autoComplete="off"
            disabled={fieldsAreDisabled || !isMaintananceEnabled}
            {...register('title')}
          />
          <Textarea
            label={t(MESSAGES.DESCRIPTION)}
            placeholder={t(MESSAGES.MAINTANANCE_DESCRIPTION_PLACEHOLDER)}
            className="w-full"
            autoComplete="off"
            disabled={fieldsAreDisabled || !isMaintananceEnabled}
            classNames={{ root: 'mt-3' }}
            minRows={5}
            autosize
            {...register('description')}
          />
          <Controller
            name="countdown"
            render={({ field }) => (
              <>
                <Divider
                  label={
                    <Switch
                      checked={!!field.value}
                      onChange={(event) =>
                        event.currentTarget.checked
                          ? field.onChange(dayjs().add(20, 'minutes'))
                          : field.onChange(null)
                      }
                      color="teal"
                      size="sm"
                      label={
                        <Text size="xs">
                          {t(MESSAGES.MAINTANANCE_COUNTDOWN)}
                        </Text>
                      }
                      classNames={{
                        track: !disabled ? '!cursor-pointer' : undefined,
                      }}
                      disabled={fieldsAreDisabled || !isMaintananceEnabled}
                      thumbIcon={
                        field.value ? (
                          <Check
                            className="w-3 h-3"
                            color={theme.colors.teal[6]}
                          />
                        ) : (
                          <X className="w-3 h-3" color={theme.colors.red[6]} />
                        )
                      }
                    />
                  }
                  labelPosition="left"
                  orientation="vertical"
                  className="h-3 my-auto mt-8 mb-4"
                />
                <div className="mt-4 ">
                  {field.value ? (
                    <DateTimePicker
                      clearable
                      size="md"
                      value={field.value ? dayjs(field.value).toDate() : null}
                      onChange={(value) =>
                        field.onChange(
                          value ? dayjs(value).toISOString() : value
                        )
                      }
                      minDate={minimumDateForMaintanance}
                      disabled={fieldsAreDisabled || !isMaintananceEnabled}
                      placeholder={t(
                        MESSAGES.MAINTANANCE_COUNTDOWN_CHOOSE_VALUE
                      )}
                    />
                  ) : null}
                </div>
              </>
            )}
          />

          <button
            ref={submitButtonRef}
            className="hidden"
            style={{ display: 'none' }}
            type="submit"
          ></button>
          <Button
            disabled={fieldsAreDisabled || !isMaintananceEnabled}
            color="green"
            type="submit"
            loading={formState.isSubmitting}
            className="mt-5"
          >
            {t(MESSAGES.SAVE)}
          </Button>
        </Paper>
      </form>
    </FormProvider>
  );
};
