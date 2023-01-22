import { ItemID } from '@prom-cms/shared';

export const pageUrls = {
  users: {
    list: '/users',
    get create() {
      return `${this.list}/create`;
    },
    view(id: ItemID) {
      return `${this.list}/${id}`;
    },
  },
  userRoles: {
    list: '/settings/roles',
    get create() {
      return `${this.list}/create`;
    },
  },
  files: {
    list(folderPath?: string) {
      const urlParams = new URLSearchParams(
        folderPath
          ? {
              folder: folderPath,
            }
          : {}
      );

      return `/files${urlParams.toString()}`;
    },
    view(id: ItemID) {
      return `${this.list()}/entries/${id}`;
    },
  },
  entryTypes: (name: string) => ({
    list: `/entry-types/${name}`,
    get create() {
      return `${this.list}/entries/create`;
    },
    view(id: ItemID) {
      return `${this.list}/entries/${id}`;
    },
    duplicate(id: ItemID) {
      return `${this.list}/entries/duplicate/${id}`;
    },
  }),
  settings: {
    profile: '/settings/profile',
    roles: '/settings/roles',
    system: '/settings/system',
    translations: (language: string) => ({
      list: `/settings/translations/${language}`,
      get create() {
        return `${this.list}/keys/create`;
      },
    }),
  },
};
