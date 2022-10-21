/**
 * Takes a string as an input and lowercases first letter
 */
export const lowerCaseFirst = (input: string) =>
  input.charAt(0).toLowerCase() + input.slice(1);
