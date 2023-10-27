import { MESSAGES } from '@constants';
import type { ApiResultModel } from '@prom-cms/shared';
import { convertColumnTypeToPrimitive } from '@prom-cms/shared';
import * as yup from 'yup';

type RepeaterRawData = null | undefined | { data?: Record<string, any>[] };

export const getModelItemSchema = (
  /**
   * config to read from
   */
  config: ApiResultModel,
  /**
   * If required logic should be included, useful when you want to return schema for update query
   */
  ignoreRequired?: boolean
) => {
  const { columns } = config;

  const yupShape = Object.keys(Object.fromEntries(columns))
    .filter((columnKey) => !columns.get(columnKey)!.hide)
    .reduce(
      (shape, columnKey) => {
        const column = columns.get(columnKey)!;
        let columnShape;

        if (column.editable === false) {
          return shape;
        }

        if (column.type === 'file') {
          const base = yup[
            convertColumnTypeToPrimitive(column.type)
          ]().transform((_, originalValue) =>
            originalValue === null
              ? null
              : typeof originalValue === 'object'
              ? Number(originalValue.id)
              : Number(originalValue)
          );

          columnShape = column.multiple ? yup.array(base) : base;
        } else if (column.type === 'json') {
          if (columnKey === 'coeditors') {
            columnShape = yup
              .object()
              .transform((_, originalValue) =>
                originalValue !== null && originalValue !== undefined
                  ? Array.isArray(originalValue)
                    ? { ...originalValue.filter((val) => val !== null) }
                    : Object.fromEntries(
                        Object.entries(originalValue).filter(
                          (_, val) => val !== null
                        )
                      )
                  : null
              );
          } else if (column.admin.fieldType === 'repeater') {
            columnShape = yup
              .object({
                data: yup.array(yup.object()).optional(),
              })
              .transform((_, originalValue: RepeaterRawData) => {
                if (
                  originalValue === null ||
                  originalValue === undefined ||
                  typeof originalValue !== 'object' ||
                  !Array.isArray(originalValue.data)
                ) {
                  return null;
                }

                const { data } = originalValue;

                return {
                  ...originalValue,
                  data: data.filter(
                    (value) =>
                      !!Object.values(value).filter(
                        (value) => value !== undefined && value !== null
                      ).length
                  ),
                };
              });
          } else if (column.admin.fieldType === 'openingHours') {
            const day = yup.lazy((value, options) => {
              switch (typeof value) {
                case 'boolean':
                  return yup
                    .boolean()
                    .transform((_value, originalValue) =>
                      originalValue === false ? false : undefined
                    )
                    .optional();
                default:
                  return yup
                    .array(yup.object({ from: yup.string(), to: yup.string() }))
                    .optional();
              }
            });

            columnShape = yup.object({
              data: yup
                .object({
                  monday: day,
                  tuesday: day,
                  wednesday: day,
                  thursday: day,
                  friday: day,
                  saturday: day,
                  sunday: day,
                })
                .optional()
                .transform((_, originalValue) => {
                  if (
                    originalValue === null ||
                    originalValue === undefined ||
                    typeof originalValue !== 'object'
                  ) {
                    return null;
                  }

                  return Object.fromEntries(
                    Object.entries<{ from?: string; to?: string }[] | false>(
                      originalValue
                    )
                      .map(([key, values]) => [
                        key,
                        Array.isArray(values)
                          ? (values || []).filter(
                              (value) => !!value.from && !!value.to
                            )
                          : values,
                      ])
                      .filter(
                        ([key, value]) => value === false || !!value?.length
                      )
                  );
                }),
            });
          } else if (column.admin.fieldType === 'color') {
            columnShape = yup.object({
              value: yup
                .string()
                .matches(
                  /^#(?:[0-9a-fA-F]{3}){1,2}$/,
                  MESSAGES.MUST_BE_VALID_COLOR
                ),
            });
          } else if (column.admin.fieldType === 'linkButton') {
            columnShape = yup.object({
              href: yup
                .string()
                .matches(
                  /(([a-zA-Z]{1,}):\/\/)?(www.)?([a-z0-9]+(\.[a-z]{2,}){1,3})?(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                  MESSAGES.MUST_BE_VALID_URL
                ),
              label: yup.string().optional(),
              action: yup.string().optional(),
            });
          } else {
            columnShape = yup[convertColumnTypeToPrimitive(column.type)]();
          }
        } else {
          columnShape =
            column.type === 'enum'
              ? yup.mixed().oneOf(column.enum)
              : yup[convertColumnTypeToPrimitive(column.type)]();
        }

        if (column.type === 'email') {
          columnShape = (columnShape as yup.StringSchema).email(
            MESSAGES.MUST_BE_VALID_EMAIL
          );
        }

        if (column.type === 'url') {
          // TODO: Support domainless url (eg: /somethings/something)
          columnShape = (columnShape as yup.StringSchema).matches(
            /(([a-zA-Z]{1,}):\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            MESSAGES.MUST_BE_VALID_URL
          );
        }

        if (column.required && !ignoreRequired) {
          columnShape = columnShape.required(MESSAGES.FIELD_REQUIRED);
        } else {
          columnShape = columnShape.nullable().notRequired();
        }

        shape[columnKey] = columnShape;

        return shape;
      },
      {} as Record<string, any>
    );

  return yup.object(yupShape).noUnknown();
};
