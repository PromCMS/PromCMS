import { Command } from '@boost/cli';
import { runPHPScript, tryFindGeneratorConfig } from '@utils';
import { Input, PasswordInput, Style, useProgram } from '@boost/cli/react';
import path from 'path';
import { USERS_SCRIPTS_ROOT } from '@constants';
import { FC, useState } from 'react';
import { ThanksMessage, WorkingMessage } from '@components';
import { useCallback } from 'react';
import { z, ZodError } from 'zod';

const Runtime: FC<{ cwd: string }> = ({ cwd }) => {
  const [isWorking, setIsWorking] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { exit } = useProgram();
  const [errorMessage, setErrorMessage] = useState('');

  // Internal state values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const runPhp = async () => {
    setErrorMessage('');
    setIsWorking(true);

    await runPHPScript({
      path: path.join(USERS_SCRIPTS_ROOT, 'change-password.php'),
      arguments: {
        cwd,
        email,
        password,
        name,
      },
    });

    setIsWorking(false);
    setIsDone(true);

    setTimeout(() => {
      exit();
    }, 100);
  };

  const onSubmitEmail = useCallback((email: string) => {
    setErrorMessage('');

    try {
      setEmail(z.string().email('Email is not a valid email').parse(email));
    } catch (error) {
      if (error instanceof ZodError) {
        setErrorMessage(error.errors.at(0)?.message ?? '');

        return;
      }

      throw error;
    }
  }, []);

  const onSubmitPassword = useCallback((password: string) => {
    setErrorMessage('');
    setPassword(password);
  }, []);

  const onSubmitName = useCallback((name: string) => {
    setErrorMessage('');
    try {
      setName(
        z
          .string()
          .min(1)
          .refine((value) => {
            const [firstName, familyName] = value.split(' ');

            return !!firstName && !!familyName;
          }, "Name must include first name and family name. Example: 'John Doe'")
          .parse(name)
      );
    } catch (error) {
      if (error instanceof ZodError) {
        setErrorMessage(error.errors.at(0)?.message ?? '');

        return;
      }

      throw error;
    }

    runPhp();
  }, []);

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

      {!email ? (
        <Input
          label="User email"
          placeholder="<some@email.com>"
          onSubmit={onSubmitEmail}
        />
      ) : null}
      {!password && email ? (
        <PasswordInput
          label="Password"
          placeholder="some-strong-password"
          onSubmit={onSubmitPassword}
        />
      ) : null}
      {!name && password && email ? (
        <Input
          label="Full name"
          placeholder="John Doe"
          onSubmit={onSubmitName}
        />
      ) : null}
    </>
  );
};

export class CreateUsersProgram extends Command {
  static path: string = 'users:create';
  static description: string = 'User creation management through cli';

  async run() {
    const currentDir = process.cwd();
    tryFindGeneratorConfig();

    return <Runtime cwd={currentDir} />;
  }
}
