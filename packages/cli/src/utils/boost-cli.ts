import fs from 'fs-extra';
import path from 'path';

const supportedConfigExtensions = ['js', 'cjs', 'json'];

export const validateConfigPathInput = (value: string | undefined) => {
  if (!value) {
    throw new Error('PromCMS config path not defined in -c value');
  }
  const requestedPath = path.join(process.cwd(), value);
  if (!fs.pathExistsSync(requestedPath)) {
    throw new Error(`PromCMS config path "${requestedPath}" does not exist`);
  }

  if (
    supportedConfigExtensions
      .map((v) => `.${v}`)
      .findIndex((supportedExtension) => value.endsWith(supportedExtension)) ===
    -1
  ) {
    throw new Error('Unsupported config extension: ');
  }
};

export const getAppRootInputValidator =
  (required = true) =>
  (value: string = '.') => {
    if (!value && required) {
      throw new Error('PromCMS root must be specified');
    }

    const requestedPath = path.join(process.cwd(), value);
    if (fs.pathExistsSync(requestedPath)) {
      throw new Error(`PromCMS root "${requestedPath}" already exists`);
    }
  };

export const pathInputToRelative = (value: string) =>
  path.join(process.cwd(), ...value.split('/'));
