import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { formatCodeString } from '../utils';

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
  const folders = (
    await fs.readdir(templateFolderPath, { withFileTypes: true })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const files = (await fs.readdir(templateFolderPath, { withFileTypes: true }))
    .filter((dirent) => dirent.isFile())
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

    // TODO: get why dockerfile is not rendered, fix twig formatting
    if (finalFilename !== 'Dockerfile' && !finalFilename.includes('twig')) {
      try {
        result = await formatCodeString(result, finalFilename);
      } catch (e) {
        console.log(
          `An error happened during formating of ${finalFilename}: ${
            e as Error
          }`
        );
        throw e;
      }
    }

    const filepath = path.join(endFolderPath, finalFilename);
    await fs.ensureFile(filepath);
    await fs.writeFile(filepath, result);
  }

  for (const folderName of folders) {
    await generateByTemplates(
      path.join(templateFolderPath, folderName),
      path.join(endFolderPath, folderName),
      templateData
    );
  }
};
