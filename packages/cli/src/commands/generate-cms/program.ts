import { Arg, Command, Config } from '@boost/cli';
import recopy from 'recursive-copy';
import path, { dirname } from 'path';
import {
  CORE_ROOT,
  PROJECT_ROOT,
  GENERATOR_FILENAME,
} from '@prom-cms/shared/src/generator-constants';
import fs from 'fs-extra';
import { execa } from 'execa';
import { generateByTemplates, loggedJobWorker, LoggedWorkerJob } from '@utils';
import { generateCoreModule } from '@commands-parts/generate-core-module';
import { formatGeneratorConfig, getGeneratorConfig } from '@prom-cms/shared';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const copyCoreOptions = {
  overwrite: true,
  expand: true,
  dot: true,
  junk: false,
  filter: new RegExp(
    /^(?!(.temp|uploads|modules|.env|.gitignore|README.md|templates))/g
  ),
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
  name.replaceAll(' ', '_').toLocaleLowerCase();

@Config('generate:cms', 'Controls a cms generator', {})
export class GenerateCMSProgram extends Command {
  @Arg.Flag('To override contents of target folder', {
    short: 'o',
  })
  override: boolean = false;

  @Arg.Flag('To just only regenerate admin and Core', {
    short: 'o',
  })
  regenerate: boolean = false;

  @Arg.Params<CustomParams>({
    label: 'root',
    description: 'Root of your final project',
    required: true,
    type: 'string',

    validate(value) {
      if (
        !/^((\.)|((\.|\.\.)\/((?!\/).*(\/)?){1,})|((?!\/).*(\/)))$/g.test(value)
      ) {
        throw new Error(
          'Folder path must be valid path, eq: ".", "../somefolder", "./somefolder"'
        );
      }

      const referenceFolder = path.join(PROJECT_ROOT, value);

      if (
        fs.existsSync(referenceFolder) &&
        fs.lstatSync(referenceFolder).isFile()
      ) {
        throw new Error('Root folder cannot be file');
      }
    },
  })
  async run(root) {
    // TODO: when in release take path from process.cwd() and attach path parameter from cli
    const currentRoot = PROJECT_ROOT;
    const generatorConfig = await getGeneratorConfig(currentRoot);
    const PROVIDED_ROOT = path.join(PROJECT_ROOT, ...root.split('/'));

    if (!generatorConfig)
      throw new Error(
        '⛔️ No generator config provided, please provide a config.'
      );

    const { database: databaseConfig, project } = await formatGeneratorConfig(
      generatorConfig
    );
    const projectNameSimplified = simplifyProjectName(project.name);
    const FINAL_PATH = path.join(PROVIDED_ROOT, projectNameSimplified);
    const ADMIN_ROOT = path.join(PROJECT_ROOT, 'packages', 'admin');

    if (
      !this.override &&
      fs.existsSync(FINAL_PATH) &&
      fs.readdirSync(FINAL_PATH).length !== 0
    ) {
      throw new Error(
        `⛔️ Your path to project "${FINAL_PATH}" cannot be empty`
      );
    }

    const jobs: LoggedWorkerJob[] = [
      // Copying core to export
      {
        title: 'Copy core files',
        async job() {
          await fs.ensureDir(FINAL_PATH);
          try {
            await recopy(CORE_ROOT, FINAL_PATH, copyCoreOptions);
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
            path.join(FINAL_PATH, GENERATOR_FILENAME),
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
            fs.remove(existingCoreModulePath);
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
