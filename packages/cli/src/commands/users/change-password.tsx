import { Command } from '@boost/cli';
import { runPHPScript, tryFindGeneratorConfig } from '@utils';
import { Input, PasswordInput, useProgram } from '@boost/cli/react';
import path from 'path';
import { USERS_SCRIPTS_ROOT } from '@constants';
import { FC, useState } from 'react';
import { ThanksMessage, WorkingMessage } from '@components';

const Runtime: FC<{ cwd: string }> = ({ cwd }) => {
  const [isWorking, setIsWorking] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { exit } = useProgram();
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const runPhp = async () => {
    setIsWorking(true);

    await runPHPScript({
      path: path.join(USERS_SCRIPTS_ROOT, 'change-password.php'),
      arguments: {
        cwd,
        id: userId,
        password: newPassword,
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

  if (!userId) {
    return (
      <Input
        label="User id"
        placeholder="some user id"
        onSubmit={(value) => setUserId(value)}
      />
    );
  }

  if (!newPassword) {
    return (
      <PasswordInput
        label="New password"
        placeholder="some-strong-password"
        onSubmit={(value) => {
          setNewPassword(value);
          runPhp();
        }}
      />
    );
  }

  return null;
};

export class ChangePasswordUserProgram extends Command {
  static path: string = 'users:change-password';
  static description: string = 'User password change management through cli';

  run() {
    const currentDir = process.cwd();
    tryFindGeneratorConfig();

    return <Runtime cwd={currentDir} />;
  }
}
