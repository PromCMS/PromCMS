import { $ } from 'execa';
import fs from 'fs-extra';
import path from 'path';

type Options = {
  cwd: string;
};

const ensureComposerScripts = async ({ cwd }: Options) => {
  const filename = path.join(cwd, 'composer.json');
  const contents = await fs.readJSON(filename, {
    encoding: 'utf8',
  });

  contents.scripts ??= {};

  contents.scripts = {
    ...contents.scripts,
    'migration:apply': ['vendor/bin/prom-cms migration:apply'],
  };

  await fs.writeJSON(filename, contents);
};

export const applyMigration = async (options: Options) => {
  const { cwd } = options;

  await ensureComposerScripts(options);

  await $({
    cwd: cwd,
  })`composer run migration:apply`;
};
