import { modifiedParse, runPHPScript, tryFindGeneratorConfig } from '@utils';
import { Input, PasswordInput, useProgram } from '@boost/cli/react';
import path from 'path';
import { THANK_YOU_MESSAGE, USERS_SCRIPTS_ROOT } from '@constants';
import { FC, useState } from 'react';
import { WorkingMessage } from '@components';
import { UserCommandBase } from './internal/UserCommandBase.js';
import { emailSchema } from '@schemas';
import { Box } from 'ink';

const Runtime: FC<{ cwd: string }> = ({ cwd }) => {
  const [isWorking, setIsWorking] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { exit, log } = useProgram();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const execute = async () => {
    setIsWorking(true);

    try {
      await runPHPScript({
        path: path.join(USERS_SCRIPTS_ROOT, 'change-password.php'),
        arguments: {
          cwd,
          email,
          password: newPassword,
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Entity is missing')
      ) {
        log.error(`User with email '${email}' does not exist`);

        setIsWorking(false);
        setIsDone(true);
        exit();
        return;
      }

      throw error;
    }

    setIsDone(true);
    setIsWorking(false);

    log.info(`Password for user ${email} has been changed!`);
    log.info(THANK_YOU_MESSAGE);

    exit();
  };

  if (isDone) {
    return null;
  }

  if (isWorking) {
    return <WorkingMessage />;
  }

  return (
    <Box flexDirection="column">
      <Input
        label="User email"
        placeholder="<some@email.com>"
        validate={(value) => modifiedParse(emailSchema.parse, value)}
        onSubmit={(value) => setEmail(value)}
      />

      {email ? (
        <PasswordInput
          label="New password"
          placeholder="some-strong-password"
          onSubmit={(value) => {
            setNewPassword(value);
            execute();
          }}
        />
      ) : null}
    </Box>
  );
};

export class ChangePasswordUserProgram extends UserCommandBase {
  static path: string = 'users:change-password';
  static description: string = 'User password change management through cli';

  run() {
    const currentDir = this.cwd || process.cwd();
    tryFindGeneratorConfig(currentDir);

    return <Runtime cwd={currentDir} />;
  }
}
