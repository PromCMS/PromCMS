import fs from 'fs-extra';
import path from 'path';
import { z } from 'zod';

export type EnsurePhpVersion = {
  cwd: string;
  versions: {
    packageName: string;
    minimalVersion: string;
    // TODO: there could be a maximal version, but it was not required first
  }[];
};

const composerJsonSchema = z
  .object({
    require: z.record(z.string()).optional(),
    ['require-dev']: z.record(z.string()).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      (!value.require || !Object.entries(value.require).length) &&
      (!value['require-dev'] || !Object.entries(value['require-dev']).length)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Must have at least one dependency in "dependencies" or "devDependencies"',
      });
    }
  });

/**
 * Finds composer.json, searches through dependencies and find desired dependency. Goes through supported versions and if version is supported then it does not throw.
 */
export const ensurePhpDependencyVersions = async (
  options: EnsurePhpVersion
) => {
  const composerJsonPathname = path.join(options.cwd, 'composer.json');

  if (!(await fs.pathExists(composerJsonPathname))) {
    throw new Error(
      `Composer config file was not found. Make sure that composer.json is present at ${options.cwd}`
    );
  }

  const composerJson = composerJsonSchema.parse(
    await fs.readJson(composerJsonPathname)
  );
  const { require: requireList, 'require-dev': requireListDev } = composerJson;

  const allDeps = { ...(requireList ?? {}), ...(requireListDev ?? {}) };
  const rules = new Map(
    options.versions.map((item) => [item.packageName, item.minimalVersion])
  );

  for (const [dependencyName, version] of Object.entries(allDeps)) {
    const ruleForPackage = rules.get(dependencyName);

    // TODO - add semver range
    if (ruleForPackage && version !== ruleForPackage) {
      throw new Error(
        `Composer dependency "${dependencyName}" must be atleast on version "${version}"`
      );
    }
  }
};
