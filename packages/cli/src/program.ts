import { createProjectAction } from '@actions/project/create.js';
import { updateProjectAction } from '@actions/project/update.js';
import { changeUserPasswordCommandAction } from '@actions/users/change-password.js';
import { createUserCommandAction } from '@actions/users/create.js';
import { deleteUserCommandAction } from '@actions/users/delete.js';
import { PACKAGE_ROOT } from '@constants';
import { adminOption } from '@options/adminOption.js';
import { cleanOption } from '@options/cleanOption.js';
import { cwdOption } from '@options/cwdOption.js';
import { packageManagerOption } from '@options/packageManagerOption.js';
import { projectNameOption } from '@options/projectNameOption.js';
import { promDevelopOption } from '@options/promDevelopOption.js';
import { ensurePromCoreVersion } from '@utils/ensurePromCoreVersion.js';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

import { findGeneratorConfig } from '@prom-cms/schema';

(async () => {
  const { version } = await fs.readJson(
    path.join(PACKAGE_ROOT, 'package.json')
  );

  const program = new Command('@prom-cms/cli')
    .version(version)
    .hook('preAction', async (command, action) => {
      const parentName = action.parent?.name();
      const currentName = action.name();
      const cwd = action.getOptionValue('cwd');

      if (!(currentName === 'create' && parentName === 'project') && cwd) {
        await Promise.all([
          ensurePromCoreVersion(cwd),
          findGeneratorConfig(cwd),
        ]);
      }
    });

  const usersCommand = program
    .command('users')
    .description('Users management made easy');

  usersCommand
    .command('create')
    .description('User creation management through cli')
    .addOption(cwdOption)
    .action(createUserCommandAction);

  usersCommand
    .command('delete')
    .description('User deletion management through cli')
    .addOption(cwdOption)
    .action(deleteUserCommandAction);

  usersCommand
    .command('change-password')
    .description('User password change management through cli')
    .addOption(cwdOption)
    .action(changeUserPasswordCommandAction);

  const projectCommand = program.command('project');

  projectCommand
    .command('create')
    .option('--no-install', 'specify if install script should be run')
    .addOption(cleanOption)
    .addOption(cwdOption)
    .addOption(packageManagerOption)
    .addOption(adminOption)
    .addOption(promDevelopOption)
    .addOption(projectNameOption)
    .action(createProjectAction);

  projectCommand
    .command('update')
    .addOption(cwdOption)
    .addOption(packageManagerOption)
    .addOption(adminOption)
    .action(updateProjectAction);

  await program.parseAsync(process.argv);
})();
