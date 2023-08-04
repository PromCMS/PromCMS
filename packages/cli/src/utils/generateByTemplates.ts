import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { formatCodeString } from './formatCodeString.js';
import { getTemplateFolder, Path } from './getTemplateFolder.js';

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
  templateData?: Record<string, any>,
  options?: GenerateByTemplatesOptions
) => {
  // Account for absolute path - aka recursive print we do at the end of this function
  const templateFolderPath = path.isAbsolute(templatePath)
    ? templatePath
    : getTemplateFolder(templatePath);

  const folders = (
    await fs.readdir(templateFolderPath, { withFileTypes: true })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const files = (await fs.readdir(templateFolderPath, { withFileTypes: true }))
    .filter((dirent) => dirent.isFile())
    .filter((dirent) =>
      options?.filter
        ? options?.filter(path.basename(dirent.name, '.ejs'))
        : true
    )
    .map((dirent) => dirent.name);

  for (const templateFilename of files) {
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
      result = await formatCodeString(result, finalFilename);
    } catch (e) {
      console.log(
        `An error happened during formating of ${finalFilename}: ${e as Error}`
      );
      throw e;
    }

    const filepath = path.join(endFolderPath, finalFilename);
    await fs.ensureFile(filepath);
    await fs.writeFile(filepath, result);
  }

  for (const folderName of folders) {
    await generateByTemplates(
      // internally we print files recursively
      path.join(templateFolderPath, folderName) as any,
      path.join(endFolderPath, folderName),
      templateData
    );
  }
};
