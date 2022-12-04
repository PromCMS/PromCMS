export const isModule = (filepath: string) => {
  if (filepath.split('.').at(-1) === 'json') {
    return false;
  }

  return true;
};
