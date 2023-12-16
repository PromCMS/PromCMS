import { SUPPORTED_PACKAGE_MANAGERS } from '@constants';

export type MaybePromise<T> = Promise<T> | T;
export type SupportedPackageManagers =
  (typeof SUPPORTED_PACKAGE_MANAGERS)[number];

export type PropelDatabaseAttributes = {
  name: string;
  defaultIdMethod: 'native' | 'none';
  package?: string;
  schema?: string;
  namespace?: string;
  baseClass?: string;
  basePeer?: string;
  /**
   * @default "underscore"
   */
  defaultPhpNamingMethod?: 'nochange' | 'underscore' | 'phpname' | 'clean';
  heavyIndexing?: true | false;
  tablePrefix?: string;
};

export type PropelColumnAttributes =
  | 'name'
  | 'phpName'
  | 'peerName'
  | 'primaryKey'
  | 'required'
  | 'type'
  | 'phpType'
  | 'sqlType'
  | 'size'
  | 'scale'
  | 'defaultValue'
  | 'defaultExpr'
  | 'valueSet'
  | 'autoIncrement'
  | 'lazyLoad'
  | 'description'
  | 'primaryString'
  | 'phpNamingMethod'
  | 'inheritance'
  | 'prom.editable'
  | 'prom.hide'
  | 'prom.title'
  | 'prom.type'
  | 'prom.readonly'
  | 'prom.labelConstructor'
  | 'prom.adminMetadata.isHidden'
  | 'prom.adminMetadata.editor.placement'
  | 'prom.adminMetadata.editor.width';

export type PropelTableAttributes =
  | 'name'
  | 'idMethod'
  | 'phpName'
  | 'package'
  | 'schema'
  | 'namespace'
  | 'skipSql'
  | 'abstract'
  | 'isCrossRef'
  | 'phpNamingMethod'
  | 'baseClass'
  | 'basePeer'
  | 'description'
  | 'heavyIndexing'
  | 'readOnly'
  | 'treeMode'
  | 'reloadOnInsert'
  | 'reloadOnUpdate'
  | 'allowPkInsert'
  | 'prom.adminMetadata.icon'
  | 'prom.title'
  | 'prom.preset'
  | 'prom.ignoreSeeding';
