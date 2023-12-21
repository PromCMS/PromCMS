import { THANK_YOU_MESSAGE } from '@constants';
import { emailSchema } from '@schemas';
import { Logger, tryFindGeneratorConfig } from '@utils';
import { createPromptWithOverrides } from '@utils/createPromptWithOverrides.js';
import { ensurePromCoreVersion } from '@utils/ensurePromCoreVersion.js';
import { runWithProgress } from '@utils/runWithProgress.js';
import { execa } from 'execa';
import { ZodError } from 'zod';

type Options = {
  cwd: string;
  email: string;
  password: string;
};

export const changeUserPasswordCommandAction = async (
  optionsFromParameters: Options
) => {
  const { cwd, email, password } = await createPromptWithOverrides(
    [
      { name: 'password', type: 'password' },
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

  try {
    await runWithProgress(
      execa(
        'vendor/bin/prom-cms',
        [`users:change-password`, '--email', email, '--password', password],
        { cwd }
      ),
      'Connect and change password for user'
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('Entity is missing')) {
      Logger.error(`User with email '${email}' does not exist`);

      return;
    }

    throw error;
  }

  Logger.info(`Password for user ${email} has been changed!`);
  Logger.info(THANK_YOU_MESSAGE);
};
