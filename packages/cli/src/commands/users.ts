import { Command, Options, Params } from '@boost/cli';
import {
  getWorkerJob,
  loggedJobWorker,
  Logger,
  runPHPScript,
  RunPHPScriptOptions,
} from '@utils';
import { Input, PasswordInput } from '@boost/cli/react';
import path from 'path';
import { SCRIPTS_ROOT } from '@constants';
import { findGeneratorConfig } from '@prom-cms/shared/generator';

type CustomParams = [AllowedAction];
type AllowedAction = typeof allowedActions[number];

const allowedActions = ['create', 'delete'] as const;

export class UsersProgram extends Command {
  static path: string = 'users';
  static description: string = 'Users management through cli';

  configPath: string;

  static params: Params<CustomParams> = [
    {
      label: 'Action',
      description: 'Desired action to make',
      required: true,
      type: 'string',
      validate(value) {
        if (!(allowedActions as readonly any[]).includes(value)) {
          throw new Error(`Unknown action '${value}'`);
        }
      },
    },
  ];

  async run(action: AllowedAction) {
    Logger.info('🙇‍♂️ Hello, PROM developer!');
    const currentDir = process.cwd();
    const userScriptsRoot = path.join(SCRIPTS_ROOT, 'php', 'commands', 'users');

    // Check that current working directory is a prom project by simply searching for a config
    try {
      await findGeneratorConfig(currentDir);
    } catch (error) {
      throw new Error(
        `⛔️ Current directory "${currentDir}" has no prom config.`
      );
    }

    try {
      switch (action) {
        case 'create':
          await loggedJobWorker.apply(this, [
            [
              getWorkerJob<{ email: string; password: string; name: string }>(
                'Payload',
                {
                  prompts: [
                    [
                      'email',
                      {
                        type: Input,
                        props: {
                          label: 'User email',
                        },
                      },
                    ],
                    [
                      'password',
                      {
                        type: PasswordInput,
                        props: {
                          label: 'User password',
                        },
                      },
                    ],
                    [
                      'name',
                      {
                        type: Input,
                        props: {
                          label: 'User name',
                        },
                      },
                    ],
                  ],

                  job: async (params) => {
                    await runPHPScript({
                      path: path.join(userScriptsRoot, 'create.php'),
                      arguments: {
                        cwd: currentDir,
                        ...params,
                      },
                    });
                  },
                }
              ),
            ],
          ]);
          break;

        case 'delete':
          await loggedJobWorker.apply(this, [
            [
              getWorkerJob<{ userId: string }>('Delete an user', {
                prompts: [
                  [
                    'userId',
                    {
                      type: Input,
                      props: {
                        label: 'User id?',
                      },
                    },
                  ],
                ],
                job: async (params) => {
                  await runPHPScript({
                    path: path.join(userScriptsRoot, 'delete.php'),
                    arguments: {
                      cwd: currentDir,
                      id: params?.userId,
                    },
                  });
                },
              }),
            ],
          ]);
          break;

        default:
          throw new Error(`Actions '${action}' not defined yet`);
      }
    } catch (error) {
      throw `⛔️ An error happened: \n${(error as Error).message}`;
    }

    Logger.success('✅ Done. Bye!');
  }
}
