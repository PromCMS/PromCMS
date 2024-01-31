import { TEMPLATES_ROOT } from '@constants';
import path from 'path';

export type Path =
  | 'command-actions.project.create'
  | 'parts.generate-core-files'
  | 'parts.generate-module'
  | 'parts.create-project-module';

export const getTemplateFolder = (requestedPath: Path) =>
  path.join(TEMPLATES_ROOT, ...requestedPath.split('.'));
