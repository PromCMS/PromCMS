import { Command, GlobalOptions, Options, Params } from '@boost/cli';
import recopy from 'recursive-copy';
import path, { dirname } from 'path';
import { GENERATOR_FILENAME__JSON } from '@prom-cms/shared';
import fs from 'fs-extra';
import { execa } from 'execa';
import {
  generateByTemplates,
  loggedJobWorker,
  LoggedWorkerJob,
  Logger,
  pathInputToRelative,
  validateConfigPathInput,
  getAppRootInputValidator,
} from '../../utils';
import { generateCoreModule } from '../../parts/generate-core-module';
import { formatGeneratorConfig, ExportConfig } from '@prom-cms/shared';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { PROJECT_ROOT, CORE_ROOT } from '../../constants';

const copyCoreOptions = {
  regenerate: {
    overwrite: true,
    expand: true,
    dot: true,
    junk: false,
    filter: new RegExp(
      /^(?!(.temp|cache|uploads|vendor|locales|modules|.env|.gitignore|README.md|templates|composer.(lock|json)))/g
    ),
  },
  initialize: {
    overwrite: true,
    expand: true,
    dot: true,
    junk: false,
    filter: new RegExp(
      /^(?!(.temp|cache|uploads|vendor|locales|modules|.env|.gitignore|README.md|templates))/g
    ),
  },
};

const copyAdminOptions = {
  overwrite: true,
  expand: true,
  dot: true,
  junk: true,
  filter: ['**/*'],
};

const __dirname = dirname(fileURLToPath(import.meta.url));
type CustomParams = [string];

const simplifyProjectName = (name: string) =>
  name.replaceAll(' ', '-').toLocaleLowerCase();

interface CustomOptions extends GlobalOptions {
  configPath: string;
  override: boolean;
  regenerate: boolean;
}

export class GenerateCMSProgram extends Command {
  static path: string = 'generate-cms';
  static description: string = 'Controls a cms generator';

  // FLAGS
  configPath: string;
  override: boolean = false;
  regenerate: boolean = false;
  static options: Options<CustomOptions> = {
    configPath: {
      type: 'string',
      description: 'To specify prom config path',
      short: 'c',
      validate: validateConfigPathInput,
      format: pathInputToRelative,
    },
    override: {
      type: 'boolean',
      description: 'To override contents of target folder',
      short: 'o',
    },
    regenerate: {
      type: 'boolean',
      description: 'To just only regenerate admin and Core',
      short: 'r',
    },
  };

  static params: Params<CustomParams> = [
    {
      label: 'Root',
      description: 'Root of your final project',
      required: true,
      type: 'string',
      validate: getAppRootInputValidator(),
      format: pathInputToRelative,
    },
  ];

  async run(root: string) {
    Logger.success(
      '🙇‍♂️ Hello, PROM developer! Sit back a few seconds while we prepare everything for you...'
    );

    const FINAL_PATH = root;
    const generatorConfig: ExportConfig = this.configPath.endsWith('.json')
      ? await fs.readJson(this.configPath)
      : (await import('file:/' + this.configPath)).default;

    const { database: databaseConfig, project } = await formatGeneratorConfig(
      generatorConfig
    );
    const projectNameSimplified = simplifyProjectName(project.name);
    const ADMIN_ROOT = path.join(PROJECT_ROOT, 'packages', 'admin');

    if (
      !this.override &&
      !this.regenerate &&
      fs.existsSync(FINAL_PATH) &&
      fs.readdirSync(FINAL_PATH).length !== 0
    ) {
      throw new Error(`⛔️ Your path to project "${FINAL_PATH}" must be empty`);
    }

    const jobs: LoggedWorkerJob[] = [
      // Copying core to export
      {
        title: 'Copy core files',
        job: async () => {
          await fs.ensureDir(FINAL_PATH);
          try {
            await recopy(
              CORE_ROOT,
              FINAL_PATH,
              copyCoreOptions[this.regenerate ? 'regenerate' : 'initialize']
            );
          } catch (e) {
            console.log({ e });
          }
        },
      },
      {
        title: 'Add another project resources',
        skip: this.regenerate,
        async job() {
          await generateByTemplates(
            path.join(__dirname, '_templates'),
            FINAL_PATH,
            {
              '*': {
                project: {
                  ...project,
                  name: projectNameSimplified,
                  security: {
                    ...(project.security || {}),
                    secret:
                      project.security?.secret ||
                      crypto.randomBytes(20).toString('hex'),
                  },
                },
              },
            }
          );
        },
      },
      {
        title: 'Paste generator config to project',
        async job() {
          await fs.writeJSON(
            path.join(FINAL_PATH, GENERATOR_FILENAME__JSON),
            generatorConfig
          );
        },
      },
      {
        title: 'Build "CORE" module into final folder',
        async job() {
          const exportModulesRoot = path.join(FINAL_PATH, 'modules');

          // Core already exists - we delete it first to not to have some ghost files
          const existingCoreModulePath = path.join(exportModulesRoot, 'Core');
          if (await fs.pathExists(existingCoreModulePath)) {
            await fs.remove(existingCoreModulePath);
          }

          await generateCoreModule(
            exportModulesRoot,
            databaseConfig.models,
            false
          );
        },
      },
      // HTML Build
      {
        title: 'Build admin html',
        async job() {
          await execa('npm', ['run', 'build:admin'], {
            cwd: PROJECT_ROOT,
          });
        },
      },
      // Copy that html to export folder...
      {
        title: 'Copy admin html',
        async job() {
          const adminFinalPath = path.join(FINAL_PATH, 'public', 'admin');

          await fs.ensureDir(adminFinalPath);
          await fs.emptyDir(adminFinalPath);

          await recopy(
            path.join(ADMIN_ROOT, 'out'),
            path.join(FINAL_PATH, 'public', 'admin'),
            copyAdminOptions
          );
        },
      },
      {
        title: 'Install dependencies',
        skip: this.regenerate,
        async job() {
          const devDeps = [
            'mini-css-extract-plugin',
            'compression-webpack-plugin',
            'css-minimizer-webpack-plugin',
            'webpack',
            'path',
            'fs-extra',
            'webpack-dev-server',
            'css-loader',
            'sass-loader',
            'sass',
            'webpack-cli',
            'chokidar',
            'ts-loader',
            'typescript',
            'prettier-plugin-twig-melody',
            '@prettier/plugin-php',
          ];
          // const deps = [];

          await execa('npm', ['install', ...devDeps, '--save-dev'], {
            cwd: FINAL_PATH,
          });
        },
      },
    ];

    await loggedJobWorker(jobs);
  }
}
