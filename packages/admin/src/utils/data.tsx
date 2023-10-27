import { CUSTOM_MODELS } from '@constants';
import isEqual from 'lodash/isEqual';

export const getObjectDiff = (
  originalObject: any,
  newObject: Record<any, any>
) => {
  const diffedResults: Record<any, any> = {};

  Object.keys(newObject).forEach((entryKey) => {
    const newValue = newObject[entryKey];
    const oldValue = originalObject[entryKey];

    if (!isEqual(newValue, oldValue)) {
      diffedResults[entryKey] = newValue;
    }
  });

  return diffedResults;
};

export const modelIsCustom = (modelName: string) =>
  CUSTOM_MODELS.includes(modelName);

export const generateUuid = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);
