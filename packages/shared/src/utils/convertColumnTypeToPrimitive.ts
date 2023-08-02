import { ColumnType } from '@prom-cms/schema';
import { PrimitiveTypes } from '../index.js';

export const convertColumnTypeToPrimitive = (
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
    case 'json':
    case 'longText':
    case 'string':
    case 'enum':
    case 'password':
    case 'slug':
      primitiveType = 'string';
      break;
    case 'number':
    case 'relationship':
    case 'file':
      primitiveType = 'number';
      break;
  }

  return primitiveType;
};
