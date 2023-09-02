import { SUPPORTED_PACKAGE_MANAGERS } from '@constants';

export type MaybePromise<T> = Promise<T> | T;
export type SupportedPackageManagers =
  (typeof SUPPORTED_PACKAGE_MANAGERS)[number];
