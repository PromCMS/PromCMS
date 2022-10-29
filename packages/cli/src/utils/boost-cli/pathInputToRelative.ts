import path from 'path';

export const pathInputToRelative = (value: string) =>
  path.join(process.cwd(), ...value.split('/'));
