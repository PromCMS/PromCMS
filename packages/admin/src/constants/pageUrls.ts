import { ItemID } from '@prom-cms/api-client';

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
  singletons: {
    view(name: string) {
      return `/entities/singletons/${name}`;
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
      return `${this.list()}/${id}`;
    },
  },
  entryTypes: (name: string) => ({
    list: `/entities/${name}`,
    get create() {
      return `${this.list}/create`;
    },
    view(id: ItemID) {
      return `${this.list}/${id}`;
    },
    duplicate(id: ItemID) {
      return `${this.list}/${id}/duplicate`;
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
