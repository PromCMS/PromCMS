import { ColumnType, PrimitiveTypes } from '../types';

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
      primitiveType = 'string';
      break;
    case 'number':
      primitiveType = 'number';
      break;
  }
  return primitiveType;
};
