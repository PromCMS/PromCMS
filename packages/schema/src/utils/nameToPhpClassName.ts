import camelCase from 'lodash/camelCase.js';
import startCase from 'lodash/startCase.js';

/**
 * Takes input string and converts it to something more suitable to php className
 *
 * Esentiall pascalCase functionality
 */
export const nameToPhpClassName = (name: string) => {
  return startCase(camelCase(name)).replace(/ /g, '');
};
