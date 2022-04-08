export const formatDroppedFiles = (currentPath: string, files: File[]) =>
  files.reduce(
    (result, file) => ({
      ...result,
      [`${currentPath === '/' ? '' : currentPath}/${file.name}`]: {
        file,
        formattedSize: file.size / 1000000 + 'MB',
        name: file.name.split('.').slice(0, -1).join(),
        uploaded: false,
      },
    }),
    {}
  )
