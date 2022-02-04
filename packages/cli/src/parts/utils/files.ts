import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { formatCodeString } from '.';

export const generateByTemplates = async (
  /**
   * Templates folder that contains representative templates files and folders
   */
  templateFolderPath: string,
  /**
   * End folder to create files to
   */
  endFolderPath: string,
  /**
   * An object which keys should be the result filename, '*' for every file or nothing to render template without data as is
   */
  templateData?: Record<string, any>
) => {
  const templateFiles = fs.readdirSync(templateFolderPath);

  for (const templateFilename of templateFiles) {
    const finalFilename = path.parse(templateFilename).name;

    const rawString = fs.readFileSync(
      path.join(templateFolderPath, templateFilename),
      'utf-8'
    );

    const pickedTemplateData = templateData
      ? templateData[finalFilename] || templateData['*']
      : undefined;

    let result = ejs.render(rawString, pickedTemplateData);

    result = formatCodeString(result, finalFilename);

    const filepath = path.join(endFolderPath, finalFilename);
    await fs.ensureFile(filepath);
    await fs.writeFile(filepath, result);
  }
};
