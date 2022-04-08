import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import ejs from 'ejs';
import { formatCodeString } from '@utils';

const __dirname = dirname(fileURLToPath(import.meta.url));

const generateApiRoutes = async (moduleRoot: string) => {
  const FINAL_FILENAME = 'api.routes.php';
  const apiRoutesFile = path.join(moduleRoot, FINAL_FILENAME);
  const apiRoutesTemplateFile = path.join(
    __dirname,
    '_templates',
    `${FINAL_FILENAME}.ejs`
  );

  const templatePayload = {};

  const templateString = fs.readFileSync(apiRoutesTemplateFile, 'utf-8');
  const result = formatCodeString(
    ejs.render(templateString, templatePayload),
    apiRoutesTemplateFile
  );

  await fs.ensureFile(apiRoutesFile);
  await fs.writeFile(apiRoutesFile, result);
};

export default generateApiRoutes;
