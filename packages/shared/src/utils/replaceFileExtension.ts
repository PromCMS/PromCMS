export const replaceFileExtension = (filename: string, extension: string) =>
  filename.replace(
    /\.[^.]+$/,
    extension.startsWith('.') ? extension : `.${extension}`
  );
