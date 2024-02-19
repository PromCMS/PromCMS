export const removeTrailingSlash = (str: string) =>
  str.endsWith('/') ? str.slice(0, -1) : str;
