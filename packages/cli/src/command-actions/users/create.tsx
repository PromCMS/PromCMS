import { THANK_YOU_MESSAGE } from '@constants';
import { emailSchema } from '@schemas';
import { Logger, tryFindGeneratorConfig } from '@utils';
import { createPromptWithOverrides } from '@utils/createPromptWithOverrides.js';
import { ensurePromCoreVersion } from '@utils/ensurePromCoreVersion.js';
import { runWithProgress } from '@utils/runWithProgress.js';
import { execa } from 'execa';
import { ZodError, z } from 'zod';

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
      execa(
        'vendor/bin/prom-cms',
        [
          `users:create`,
          '--email',
          email,
          '--password',
          password,
          '--name',
          name,
        ],
        { cwd }
      ),
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
