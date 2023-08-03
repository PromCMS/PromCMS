import { ActionIcon, Checkbox, clsx, Input, Select } from '@mantine/core';
import dayjs from 'dayjs';
import { FC, useMemo } from 'react';
import { Trash, Plus } from 'tabler-icons-react';

import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import { FieldPlacements } from '@prom-cms/schema';

export const DAYS_IN_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
const MINUTES_IN_HOUR = 60;
const HOURS_IN_A_DAY = 24;
const spaceBetweenSteps = 15;
const numberOfHourSlices = MINUTES_IN_HOUR / spaceBetweenSteps; // Four slices in an hour
const now = dayjs();

const timeOptions = [...new Array(HOURS_IN_A_DAY * numberOfHourSlices)].map(
  (_, index) => {
    return now
      .set('hour', Math.floor(index / numberOfHourSlices))
      .set(
        'minute',
        MINUTES_IN_HOUR *
          (index / numberOfHourSlices - Math.floor(index / numberOfHourSlices))
      )
      .format('HH:mm');
  }
);

const RowSelect: FC<{ name: string }> = ({ name }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    name,
  });

  const allFields = useMemo(
    () => (fields.length ? fields : [{ id: 'default' }]),
    [fields]
  );

  return (
    <>
      {allFields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-5">
          <Controller
            name={`${name}.${index}.from`}
            render={({ field: { value, onChange } }) => (
              <Select
                className="items-center sm:flex sm:gap-3 [&>label]:flex-none"
                label={t('From')}
                placeholder={t('Pick time')}
                value={value}
                onChange={onChange}
                data={timeOptions}
              />
            )}
          />
          <Controller
            name={`${name}.${index}.to`}
            render={({ field: { value, onChange } }) => (
              <Select
                className="items-center sm:flex sm:gap-3 [&>label]:flex-none"
                label={t('To')}
                placeholder={t('Pick time')}
                value={value}
                onChange={onChange}
                data={timeOptions}
              />
            )}
          />
          <div className={'grid flex-none grid-cols-2'}>
            <ActionIcon
              size="xl"
              p="xs"
              variant="subtle"
              color="blue"
              onClick={() => append({})}
            >
              <Plus />
            </ActionIcon>

            <ActionIcon
              disabled={index === 0}
              className={clsx(index == 0 && 'opacity-0')}
              size="xl"
              p="xs"
              variant="subtle"
              color="red"
              onClick={() => remove(index)}
            >
              <Trash />
            </ActionIcon>
          </div>
        </div>
      ))}
    </>
  );
};

const Row: FC<{
  name: string;
  weekdayName: string;
}> = ({ name, weekdayName }) => {
  const { t } = useTranslation();
  const formContext = useFormContext();
  const { watch } = formContext;
  const value = watch(name);

  return (
    <div className="flex min-h-[70px] flex-col gap-5 py-5 lg:flex-row lg:justify-between lg:gap-16">
      <div className="flex grid-cols-2 justify-between gap-8 lg:grid lg:pt-3.5">
        <div className="font-medium uppercase text-gray-800">
          {t(capitalizeFirstLetter(weekdayName))}
        </div>
        <Controller
          name={name}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              checked={value === false}
              label={t('Closed')}
              onChange={(event) =>
                onChange(event.currentTarget.checked ? false : [])
              }
            />
          )}
        />
      </div>
      <div className="grid gap-5">
        {Array.isArray(value) ? <RowSelect name={name} /> : null}
      </div>
    </div>
  );
};

export const OpeningHours: FC<{
  name: string;
  label?: string;
  placement: FieldPlacements;
}> = ({ name: parentFieldName, label, placement }) => {
  const formContext = useFormContext();
  const errorMessage = useMemo(
    () => formContext.formState.errors[parentFieldName]?.message,
    [formContext.formState.errors]
  );

  return (
    <Input.Wrapper
      size="md"
      label={label}
      error={errorMessage ? String(errorMessage) : ''}
    >
      <div
        className={clsx([
          'mt-2 grid divide-y-2 divide-gray-100',
          placement === FieldPlacements.MAIN &&
            'rounded-lg border border-gray-200 bg-white px-5',
        ])}
      >
        {DAYS_IN_WEEK.map((name) => (
          <Row
            key={name}
            weekdayName={name}
            name={`${parentFieldName}.data.${name}`}
          />
        ))}
      </div>
    </Input.Wrapper>
  );
};
