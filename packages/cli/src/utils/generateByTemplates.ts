import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { formatCodeString } from './formatCodeString.js';
import { getTemplateFolder, Path } from './getTemplateFolder.js';
import { glob } from 'glob';

export type GenerateByTemplatesOptions = {
  /**
   * File filter
   */
  filter?: (fileName: string) => boolean;
};

export const generateByTemplates = async (
  /**
   * Templates folder that contains representative templates files and folders
   */
  templatePath: Path,
  /**
   * End folder to create files to
   */
  endFolderPath: string,
  /**
   * An object which keys should be the result filename, '*' for every file or nothing to render template without data as is
   */
  templateData?: Record<string, any>
) => {
  // Account for absolute path - aka recursive print we do at the end of this function
  const templateFolderPath = path.isAbsolute(templatePath)
    ? templatePath
    : getTemplateFolder(templatePath);

  const templateFiles = await glob('**/*.ejs', {
    dot: true,
    cwd: templateFolderPath,
  });

  for (const templateFilename of templateFiles) {
    const finalFilename = path.parse(templateFilename).name;
    const rawString = fs.readFileSync(
      path.join(templateFolderPath, templateFilename),
      'utf-8'
    );

    const pickedTemplateData = templateData
      ? templateData[finalFilename] || templateData['*']
      : undefined;

    let result: string = '';
    try {
      result = ejs.render(rawString, pickedTemplateData);
    } catch (e) {
      console.log(
        `An error happened during template build - ${(e as Error).message}`
      );
      throw e;
    }

    try {
      result = await formatCodeString(
        result.replaceAll(/^\s*[\r\n]/gm, ''),
        finalFilename
      );
    } catch (e) {
      console.log(
        `An error happened during formating of ${finalFilename}: ${e as Error}`
      );
      throw e;
    }

    const filepath = path.join(
      endFolderPath,
      path.join(path.dirname(templateFilename), finalFilename)
    );
    await fs.ensureFile(filepath);
    await fs.writeFile(filepath, result);
  }
};
