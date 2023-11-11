import axios, { Axios, AxiosRequestConfig, AxiosError } from 'axios';
import {
  HTTP_STATUS_CODE_FILE_TOO_LARGE,
  HTTP_STATUS_CODE_UNSUPPORTED_FILE_EXTENSION,
} from '../constants';
import { UnsupportedFileExtensionError } from '../exceptions/UnsupportedFileExtensionError';
import { FileTooLargeError } from '../exceptions/FileTooLargeError';

import { AuthApiClient } from './parts/AuthApiClient';
import { EntryApiClient } from './parts/EntryApiClient';
import { FileApiClient } from './parts/FileApiClient';
import { FolderApiClient } from './parts/FolderApiClient';
import { GeneralTranslationsApiClient } from './parts/GeneralTranslationsApiClient';
import { ProfileApiClient } from './parts/ProfileApiClient';
import { SettingsApiClient } from './parts/SettingsApiClient';
import { SingletonApiClient } from './parts/SingletonApiClient';
import { UserApiClient } from './parts/UserApiClient';

export class ApiClient {
  private axios: Axios;
  auth: AuthApiClient;
  entries: EntryApiClient;
  files: FileApiClient;
  folders: FolderApiClient;
  profile: ProfileApiClient;
  settings: SettingsApiClient;
  singletons: SingletonApiClient;
  users: UserApiClient;
  generalTranslations: GeneralTranslationsApiClient;

  constructor(config?: AxiosRequestConfig) {
    this.axios = axios.create(config);

    this.axios.interceptors.response.use(undefined, function (error) {
      let finalError = error;

      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case HTTP_STATUS_CODE_FILE_TOO_LARGE:
            finalError = new FileTooLargeError(error);
            break;
          case HTTP_STATUS_CODE_UNSUPPORTED_FILE_EXTENSION:
            finalError = new UnsupportedFileExtensionError(error);
            break;
        }
      }

      return Promise.reject(finalError);
    });

    this.auth = new AuthApiClient(this.axios);
    this.entries = new EntryApiClient(this.axios);
    this.files = new FileApiClient(this.axios);
    this.folders = new FolderApiClient(this.axios);
    this.profile = new ProfileApiClient(this.axios);
    this.settings = new SettingsApiClient(this.axios);
    this.singletons = new SingletonApiClient(this.axios);
    this.users = new UserApiClient(this.axios);
    this.generalTranslations = new GeneralTranslationsApiClient(this.axios);
  }

  getAxios() {
    return this.axios;
  }
}
