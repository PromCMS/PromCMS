import axiox, { Axios, AxiosRequestConfig } from 'axios';

import { AuthApiClient } from './parts/AuthApiClient';
import { EntryApiClient } from './parts/EntryApiClient';
import { FileApiClient } from './parts/FileApiClient';
import { FolderApiClient } from './parts/FolderApiClient';
import { ProfileApiClient } from './parts/ProfileApiClient';
import { SettingsApiClient } from './parts/SettingsApiClient';
import { UserApiClient } from './parts/UserApiClient';

export class ApiClient {
  private axios: Axios;
  auth: AuthApiClient;
  entries: EntryApiClient;
  files: FileApiClient;
  folders: FolderApiClient;
  profile: ProfileApiClient;
  settings: SettingsApiClient;
  users: UserApiClient;

  constructor(config?: AxiosRequestConfig) {
    this.axios = axiox.create(config);
    this.auth = new AuthApiClient(this.axios);
    this.entries = new EntryApiClient(this.axios);
    this.files = new FileApiClient(this.axios);
    this.folders = new FolderApiClient(this.axios);
    this.profile = new ProfileApiClient(this.axios);
    this.settings = new SettingsApiClient(this.axios);
    this.users = new UserApiClient(this.axios);
  }
}
