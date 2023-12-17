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
    dependencies: z.record(z.string()).optional(),
    devDependencies: z.record(z.string()).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      (!value.dependencies || !Object.entries(value.dependencies).length) &&
      (!value.devDependencies || !Object.entries(value.devDependencies).length)
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
  const { dependencies, devDependencies } = composerJson;

  const allDeps = { ...(dependencies ?? {}), ...(devDependencies ?? {}) };
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
