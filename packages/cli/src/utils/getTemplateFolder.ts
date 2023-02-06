import { TEMPLATES_ROOT } from '@constants';
import path from 'path';

export type Path =
  | 'commands.generate-cms'
  | 'parts.generate-core-files'
  | 'parts.generate-models'
  | 'parts.generate-module'
  | 'parts.generate-project-module';

export const getTemplateFolder = (requestedPath: Path) =>
  path.join(TEMPLATES_ROOT, ...requestedPath.split('.'));
