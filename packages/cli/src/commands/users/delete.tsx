import { modifiedParse, runPHPScript, tryFindGeneratorConfig } from '@utils';
import path from 'path';
import { THANK_YOU_MESSAGE, USERS_SCRIPTS_ROOT } from '@constants';
import { FC, useState } from 'react';
import { Input, useProgram, Confirm } from '@boost/cli/react';
import { WorkingMessage } from '@components';
import { UserCommandBase } from './internal/UserCommandBase.js';
import { emailSchema } from '@schemas';
import { Box } from 'ink';

const Runtime: FC<{ cwd: string }> = ({ cwd }) => {
  const [isWorking, setIsWorking] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { exit, log } = useProgram();
  const [email, setEmail] = useState('');

  const execute = async () => {
    setIsWorking(true);

    try {
      await runPHPScript({
        path: path.join(USERS_SCRIPTS_ROOT, 'delete.php'),
        arguments: {
          cwd,
          email,
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
      } else {
        throw error;
      }
    }

    setIsDone(true);
    setIsWorking(false);
    log.info(`User ${email} successfully deleted!`);
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
        <Confirm
          label={`Do you really want to delete user "${email}"`}
          onSubmit={(value) => {
            if (!value) {
              exit();

              return;
            }

            execute();
          }}
        />
      ) : null}
    </Box>
  );
};

export class DeleteUserProgram extends UserCommandBase {
  static path: string = 'users:delete';
  static description: string = 'User deletion management through cli';

  async run() {
    const currentDir = this.cwd || process.cwd();
    tryFindGeneratorConfig(currentDir);

    return <Runtime cwd={currentDir} />;
  }
}
