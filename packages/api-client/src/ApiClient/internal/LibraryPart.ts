import { Axios } from 'axios';

import { FilesPart } from './FilesPart';
import { FoldersPart } from './FoldersPart';

export class LibraryPart {
  private axios: Axios;
  readonly files: FilesPart;
  readonly folders: FoldersPart;

  constructor(axios: Axios) {
    this.axios = axios;

    this.files = new FilesPart(this.axios);
    this.folders = new FoldersPart(this.axios);
  }
}
