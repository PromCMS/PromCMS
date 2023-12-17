import { THANK_YOU_MESSAGE } from '@constants';
import { emailSchema } from '@schemas';
import { Logger, tryFindGeneratorConfig } from '@utils';
import { createPromptWithOverrides } from '@utils/createPromptWithOverrides.js';
import { ensurePromCoreVersion } from '@utils/ensurePromCoreVersion.js';
import { runWithProgress } from '@utils/runWithProgress.js';
import { execa } from 'execa';
import inquirer from 'inquirer';
import { ZodError } from 'zod';

type Options = {
  cwd: string;
  email: string;
};

export const deleteUserCommandAction = async (
  optionsFromParameters: Options
) => {
  await tryFindGeneratorConfig(optionsFromParameters.cwd);
  await ensurePromCoreVersion(optionsFromParameters.cwd);

  const { cwd, email } = await createPromptWithOverrides(
    [
      {
        name: 'email',
        type: 'input',
        validate: (value) => {
          try {
            emailSchema.parse(value);

            return true;
          } catch (error) {
            if (error instanceof ZodError) {
              return (
                error.errors.map((value) => value.message).join(' and ') ?? ''
              );
            }

            throw error;
          }
        },
      },
    ],
    optionsFromParameters
  );

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
    confirm: {
      type: 'confirm',
      message: `Do you really want to delete user "${email}"`,
      default: true,
    },
  });

  if (!confirm) {
    Logger.info('Stopping, bye!');
    return;
  }

  try {
    await runWithProgress(
      execa('vendor/bin/prom-cms', [`users:delete`, '--email', email], { cwd }),
      'Connect and delete user'
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('Entity is missing')) {
      Logger.error(`User with email '${email}' does not exist`);

      return;
    }

    throw error;
  }

  Logger.info(`User under email ${email} has been deleted!`);
  Logger.info(THANK_YOU_MESSAGE);
};
