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
