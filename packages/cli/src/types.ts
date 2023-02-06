import { SUPPORTED_PACKAGE_MANAGERS } from '@constants';
import { PromptItem } from '@utils';

export type MaybePromise<T> = Promise<T> | T;
export type SupportedPackageManagers =
  typeof SUPPORTED_PACKAGE_MANAGERS[number];

export type LoggedWorkerJob<
  T extends Record<string, any> | undefined = Record<string, any>
> = {
  title: string;
  prompts?: [keyof T, PromptItem][];
  job: (params?: T) => MaybePromise<void>;
  skip?: boolean;
};
