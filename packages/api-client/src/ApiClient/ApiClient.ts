import axios, { Axios, AxiosError, AxiosRequestConfig } from 'axios';

import {
  HTTP_STATUS_CODE_FILE_TOO_LARGE,
  HTTP_STATUS_CODE_UNSUPPORTED_FILE_EXTENSION,
} from '../constants';
import { FileTooLargeError } from '../exceptions/FileTooLargeError';
import { UnsupportedFileExtensionError } from '../exceptions/UnsupportedFileExtensionError';
import { AuthPart } from './internal/AuthPart';
import { EntriesPart } from './internal/EntriesPart';
import { GeneralTranslationsPart } from './internal/GeneralTranslationsPart';
import { LibraryPart } from './internal/LibraryPart';
import { ProfilePart } from './internal/ProfilePart';
import { SettingsPart } from './internal/SettingsPart';
import { SingletonsPart } from './internal/SingletonsPart';
import { UsersPart } from './internal/UsersPart';

export class ApiClient {
  private axios: Axios;

  readonly auth: AuthPart;
  readonly entries: EntriesPart;
  readonly library: LibraryPart;
  readonly profile: ProfilePart;
  readonly settings: SettingsPart;
  readonly singletons: SingletonsPart;
  readonly users: UsersPart;
  readonly generalTranslations: GeneralTranslationsPart;

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

    this.auth = new AuthPart(this.axios);
    this.entries = new EntriesPart(this.axios);
    this.library = new LibraryPart(this.axios);
    this.profile = new ProfilePart(this.axios);
    this.settings = new SettingsPart(this.axios);
    this.singletons = new SingletonsPart(this.axios);
    this.users = new UsersPart(this.axios);
    this.generalTranslations = new GeneralTranslationsPart(this.axios);
  }

  getAxios() {
    return this.axios;
  }
}
