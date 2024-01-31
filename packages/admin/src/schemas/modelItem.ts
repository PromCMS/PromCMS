import { MESSAGES } from '@constants';
import { z } from 'zod';

import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/api-client';
import { ColumnType } from '@prom-cms/schema';

export type PrimitiveTypes = 'number' | 'string' | 'boolean' | 'date';

const convertColumnTypeToPrimitive = (
  type: ColumnType['type']
): PrimitiveTypes => {
  let primitiveType;

  switch (type) {
    case 'date':
      primitiveType = 'date';
      break;
    case 'boolean':
      primitiveType = 'boolean';
      break;
    case 'number':
    case 'relationship':
    case 'file':
      primitiveType = 'number';
      break;
    default:
      primitiveType = 'string';
      break;
  }

  return primitiveType;
};

z.string({
  required_error: MESSAGES.FIELD_REQUIRED,
});

const urlSchema = z
  .string()
  .regex(
    /(([a-zA-Z]{1,}):\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
    MESSAGES.MUST_BE_VALID_URL
  );

const coeditorsSchema = z
  .record(z.any())
  .transform((originalValue) =>
    Array.isArray(originalValue)
      ? { ...originalValue.filter((val) => val !== null) }
      : Object.fromEntries(
          Object.entries(originalValue).filter((_, val) => val !== null)
        )
  );

const emailSchema = z.string().email(MESSAGES.MUST_BE_VALID_EMAIL);

const jsonRepeaterSchema = z
  .object({
    data: z.array(z.record(z.any())).optional(),
  })
  .transform((originalValue) => {
    if (
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

const daySchema = z
  .boolean()
  .transform((value) => (value === false ? false : undefined))
  .or(z.array(z.object({ from: z.string(), to: z.string() })))
  .optional();

const jsonLinkButtonSchema = z.object({
  href: z
    .string()
    .regex(
      /(([a-zA-Z]{1,}):\/\/)?(www.)?([a-z0-9]+(\.[a-z]{2,}){1,3})?(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      MESSAGES.MUST_BE_VALID_URL
    ),
  label: z.string().optional(),
  action: z.string().optional(),
});

const jsonOpeningHoursSchema = z.object({
  data: z
    .object({
      monday: daySchema,
      tuesday: daySchema,
      wednesday: daySchema,
      thursday: daySchema,
      friday: daySchema,
      saturday: daySchema,
      sunday: daySchema,
    })
    .optional()
    .transform((originalValue) => {
      if (originalValue === undefined) {
        return null;
      }

      return Object.fromEntries(
        Object.entries<{ from?: string; to?: string }[] | false>(originalValue)
          .map(([key, values]) => [
            key,
            Array.isArray(values)
              ? (values || []).filter((value) => !!value.from && !!value.to)
              : values,
          ])
          .filter(([key, value]) => value === false || !!value?.length)
      );
    }),
});

const jsonColorSchema = z.object({
  value: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, MESSAGES.MUST_BE_VALID_COLOR),
});

const relatedFieldSchema = z
  .number()
  .or(z.object({ id: z.number().or(z.string()) }))
  .transform((value) =>
    typeof value === 'object' ? Number(value.id) : Number(value)
  );

// TODO: this should be moved to backend and client should only fetch json schemas
export const getModelItemSchema = (
  /**
   * config to read from
   */
  config: ApiResultModel | ApiResultModelSingleton,
  /**
   * If required logic should be included, useful when you want to return schema for update query
   */
  ignoreRequired?: boolean
) => {
  const { columns, draftable } = config;

  const shape = columns
    .filter(
      (column) => !column.hide && !column.admin.isHidden && !column.readonly
    )
    .reduce(
      (shape, column) => {
        let columnShape: z.ZodTypeAny =
          z[convertColumnTypeToPrimitive(column.type)]();

        switch (column.type) {
          case 'file':
            const base = relatedFieldSchema;

            columnShape = column.multiple ? z.array(base) : base;
            break;
          case 'json':
            if (column.name === 'coeditors') {
              columnShape = coeditorsSchema;
            } else {
              switch (column.admin.fieldType) {
                case 'repeater':
                  columnShape = jsonRepeaterSchema;
                  break;
                case 'blockEditor':
                  columnShape = z
                    .string()
                    .or(z.record(z.any()))
                    .transform((value) =>
                      typeof value === 'string' ? JSON.parse(value) : value
                    );
                  break;
                case 'openingHours':
                  columnShape = jsonOpeningHoursSchema;
                  break;
                case 'color':
                  columnShape = jsonColorSchema;
                  break;
                case 'linkButton':
                  columnShape = jsonLinkButtonSchema;
                  break;
              }
            }
            break;
          case 'email':
            columnShape = emailSchema;
            break;
          case 'url':
            // TODO: Support domainless url (eg: /somethings/something)
            columnShape = urlSchema;
            break;
          case 'enum':
            columnShape = z.enum(column.enum as any);
            break;
        }

        if (!column.required && ignoreRequired) {
          columnShape = columnShape.nullish().optional();
        }

        shape[column.name] = columnShape;

        return shape;
      },
      {} as Record<string, any>
    );

  if (draftable) {
    shape.is_published = z.boolean().default(false);
  }

  return z.object(shape);
};
