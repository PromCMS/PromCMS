import { MESSAGES } from '@constants';
import { ActionIcon, Checkbox, Input, Select } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { FC, useMemo } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Plus, Trash } from 'tabler-icons-react';

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

const RowSelect: FC<{ name: string; disabled?: boolean }> = ({
  name,
  disabled,
}) => {
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
        <div key={field.id} className="flex items-end gap-5">
          <div className="w-5 hidden md:block" />
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
                disabled={disabled}
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
                disabled={disabled}
              />
            )}
          />
          <div className="grid flex-none grid-cols-2">
            <ActionIcon
              size="xl"
              p="xs"
              variant="subtle"
              color="blue"
              onClick={() => append({})}
              disabled={disabled}
            >
              <Plus />
            </ActionIcon>

            <ActionIcon
              disabled={index === 0 || disabled}
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
  disabled?: boolean;
}> = ({ name, weekdayName, disabled }) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      render={({ field: { value, onChange } }) => (
        <div className="min-h-[70px] flex-col flex gap-3 py-2 lg:justify-between lg:gap-5">
          <div className="flex items-center gap-8 lg:pt-3.5">
            <div className="font-medium uppercase text-gray-800 dark:text-white">
              {t(upperFirst(weekdayName))}
            </div>
            <hr
              className={clsx(
                'w-full m-0 h-0.5 duration-200',
                Array.isArray(value) ? 'bg-blue-100' : 'bg-gray-100'
              )}
            />

            <Checkbox
              checked={Array.isArray(value)}
              label={t(MESSAGES.OPENING_HOURS_OPEN)}
              disabled={disabled}
              onChange={(event) =>
                onChange(event.currentTarget.checked ? [] : false)
              }
            />
          </div>
          <div className="grid gap-5">
            {Array.isArray(value) ? (
              <RowSelect disabled={disabled} name={name} />
            ) : null}
          </div>
        </div>
      )}
    />
  );
};

export const OpeningHours: FC<{
  name: string;
  label?: string;
  placement: FieldPlacements;
  disabled?: boolean;
}> = ({ name: parentFieldName, label, placement, disabled }) => {
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
          'mt-2 grid',
          placement === FieldPlacements.MAIN &&
            'rounded-lg border border-blue-200 bg-white backdrop-blur-md dark:bg-transparent px-5 pb-5',
        ])}
      >
        {DAYS_IN_WEEK.map((name) => (
          <Row
            key={name}
            weekdayName={name}
            name={`${parentFieldName}.data.${name}`}
            disabled={disabled}
          />
        ))}
      </div>
    </Input.Wrapper>
  );
};
