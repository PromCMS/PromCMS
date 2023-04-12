import { modifiedParse, runPHPScript, tryFindGeneratorConfig } from '@utils';
import { Input, PasswordInput, useProgram } from '@boost/cli/react';
import path from 'path';
import { THANK_YOU_MESSAGE, USERS_SCRIPTS_ROOT } from '@constants';
import { FC, useState } from 'react';
import { WorkingMessage } from '@components';
import { z } from 'zod';
import { UserCommandBase } from './internal/UserCommandBase.js';
import { emailSchema } from '@schemas';
import { Box } from 'ink';

const nameSchema = z
  .string()
  .min(1)
  .refine((value) => {
    const [firstName, familyName] = value.split(' ');

    return !!firstName && !!familyName;
  }, "Name must include first name and family name. Example: 'John Doe'");

const Runtime: FC<{ cwd: string }> = ({ cwd }) => {
  const [isWorking, setIsWorking] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { exit, log } = useProgram();

  // Internal state values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const execute = async () => {
    setIsWorking(true);

    await runPHPScript({
      path: path.join(USERS_SCRIPTS_ROOT, 'create.php'),
      arguments: {
        cwd,
        email,
        password,
        name,
      },
    });

    setIsWorking(false);
    setIsDone(true);

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
          label="Password"
          placeholder="some-strong-password"
          onSubmit={(value) => setPassword(value)}
        />
      ) : null}

      {email && password ? (
        <Input
          label="Full name"
          placeholder="John Doe"
          validate={(value) => modifiedParse(nameSchema.parse, value)}
          onSubmit={(value) => {
            setName(value);
            execute();
          }}
        />
      ) : null}
    </Box>
  );
};

export class CreateUsersProgram extends UserCommandBase {
  static path: string = 'users:create';
  static description: string = 'User creation management through cli';

  async run() {
    const currentDir = this.cwd || process.cwd();
    tryFindGeneratorConfig(currentDir);

    return <Runtime cwd={currentDir} />;
  }
}
