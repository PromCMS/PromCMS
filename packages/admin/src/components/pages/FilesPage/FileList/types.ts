export type UploadingFile = {
  file: File;
  name: string;
  formattedSize: string;
  uploaded: boolean;
  error?: boolean;
};

/**
 * Object with working files - key is current path to uploading file which holds all of info in value
 */
export type UploadingFilesRecord = Record<string, UploadingFile>;
