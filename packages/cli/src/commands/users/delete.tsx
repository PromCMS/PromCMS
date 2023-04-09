import { Command } from '@boost/cli';
import { runPHPScript, tryFindGeneratorConfig } from '@utils';
import path from 'path';
import { USERS_SCRIPTS_ROOT } from '@constants';
import { FC, useState } from 'react';
import { Input, Style, useProgram } from '@boost/cli/react';
import { ThanksMessage, WorkingMessage } from '@components';
import { z, ZodError } from 'zod';

const Runtime: FC<{ cwd: string }> = ({ cwd }) => {
  const [isWorking, setIsWorking] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { exit } = useProgram();
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');

  const runPhp = async () => {
    setIsWorking(true);

    await runPHPScript({
      path: path.join(USERS_SCRIPTS_ROOT, 'delete.php'),
      arguments: {
        cwd,
        id: userId,
      },
    });

    setIsWorking(false);
    setIsDone(true);

    setTimeout(() => {
      exit();
    }, 100);
  };

  if (isDone) {
    return <ThanksMessage />;
  }

  if (isWorking) {
    return <WorkingMessage />;
  }

  return (
    <>
      {errorMessage ? (
        <Style bold type="failure">
          {errorMessage}
        </Style>
      ) : null}

      {!userId ? (
        <Input
          label="User id"
          placeholder="some user id"
          onSubmit={(incomingValue) => {
            try {
              setUserId(
                String(
                  z
                    .string()
                    .transform((value) => Number(value))
                    .refine((value) => !Number.isNaN(value) && value >= 0)
                    .parse(incomingValue)
                )
              );
            } catch (error) {
              if (error instanceof ZodError) {
                setErrorMessage(error.errors.at(0)?.message ?? '');

                return;
              }

              throw error;
            }

            runPhp();
          }}
        />
      ) : null}
    </>
  );
};

export class DeleteUserProgram extends Command {
  static path: string = 'users:delete';
  static description: string = 'User deletion management through cli';

  async run() {
    const currentDir = process.cwd();
    tryFindGeneratorConfig();

    return <Runtime cwd={currentDir} />;
  }
}
