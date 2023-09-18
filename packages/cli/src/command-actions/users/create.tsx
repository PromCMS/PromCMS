import { Logger, runPHPScript, tryFindGeneratorConfig } from '@utils';
import path from 'path';
import { THANK_YOU_MESSAGE, USERS_SCRIPTS_ROOT } from '@constants';
import { z, ZodError } from 'zod';
import { emailSchema } from '@schemas';
import { createPromptWithOverrides } from '@utils/createPromptWithOverrides.js';
import { runWithProgress } from '@utils/runWithProgress.js';

const nameSchema = z
  .string()
  .min(1)
  .refine((value) => {
    const [firstName, familyName] = value.split(' ');

    return !!firstName && !!familyName;
  }, "Name must include first name and family name. Example: 'John Doe'");

type Options = {
  cwd: string;
  email: string;
  password: string;
  name: string;
};

export const createUserCommandAction = async (
  optionsFromParameters: Options
) => {
  tryFindGeneratorConfig(optionsFromParameters.cwd);

  const { cwd, email, password, name } = await createPromptWithOverrides(
    [
      {
        name: 'name',
        type: 'input',
        validate(value) {
          try {
            nameSchema.parse(value);

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
      runPHPScript({
        path: path.join(USERS_SCRIPTS_ROOT, 'create.php'),
        arguments: {
          cwd,
          email,
          password,
          name,
        },
      }),
      'Connect and create new user'
    );
  } catch (error) {
    // TODO
    if (error instanceof Error && error.message.includes('Entity is missing')) {
      Logger.error(`User with email '${email}' does not exist`);

      return;
    }

    throw error;
  }

  Logger.info(`User has been created!`);
  Logger.info(THANK_YOU_MESSAGE);
};
