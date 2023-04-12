import path from 'node:path';

/**
 * Converts path to absolute
 * @param cwd CWD that is attached before input if not absolute, default is return of process.cwd call
 */
export const pathToAbsolute = (input: string, cwd = process.cwd()) => {
  if (path.isAbsolute(input)) {
    return input;
  }

  return path.join(cwd, input);
};
