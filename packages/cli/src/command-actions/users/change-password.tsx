import { Logger, runPHPScript, tryFindGeneratorConfig } from '@utils';
import path from 'path';
import { THANK_YOU_MESSAGE, USERS_SCRIPTS_ROOT } from '@constants';
import { emailSchema } from '@schemas';
import { createPromptWithOverrides } from '@utils/createPromptWithOverrides.js';
import { ZodError } from 'zod';
import { runWithProgress } from '@utils/runWithProgress.js';

type Options = {
  cwd: string;
  email: string;
  password: string;
};

export const changeUserPasswordCommandAction = async (
  optionsFromParameters: Options
) => {
  tryFindGeneratorConfig(optionsFromParameters.cwd);

  const { cwd, email, password } = await createPromptWithOverrides(
    [
      { name: 'password', type: 'password' },
      {
        name: 'email',
        type: 'input',
        validate: (value) => {
          try {
            return emailSchema.parse(value);
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
      runPHPScript({
        path: path.join(USERS_SCRIPTS_ROOT, 'change-password.php'),
        arguments: {
          cwd,
          email,
          password,
        },
      }),
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
