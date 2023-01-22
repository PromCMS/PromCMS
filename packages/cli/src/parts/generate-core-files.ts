import { generateByTemplates } from '@utils';

const generateCore = async (projectRoot: string) =>
  generateByTemplates('parts.generate-core-files', projectRoot);

export default generateCore;
