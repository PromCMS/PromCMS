/* prettier-ignore-start */

/* eslint-disable */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// This file is auto-generated by TanStack Router
// Import Routes
import { Route as R404Import } from './routes/__404';
import { Route as rootRoute } from './routes/__root';
import { Route as AuthorizedImport } from './routes/_authorized';
import { Route as AuthorizedEntitiesModelIdEntryIdDuplicateIndexImport } from './routes/_authorized/entities/$modelId/$entryId/duplicate/index';
import { Route as AuthorizedEntitiesModelIdEntryIdIndexImport } from './routes/_authorized/entities/$modelId/$entryId/index';
import { Route as AuthorizedEntitiesModelIdCreateIndexImport } from './routes/_authorized/entities/$modelId/create/index';
import { Route as AuthorizedEntitiesModelIdIndexImport } from './routes/_authorized/entities/$modelId/index';
import { Route as AuthorizedEntitiesSingletonsSingletonIdIndexImport } from './routes/_authorized/entities/singletons/$singletonId/index';
import { Route as AuthorizedFilesFileIdIndexImport } from './routes/_authorized/files/$fileId/index';
import { Route as AuthorizedFilesIndexImport } from './routes/_authorized/files/index';
import { Route as AuthorizedIndexImport } from './routes/_authorized/index';
import { Route as AuthorizedSettingsProfileIndexImport } from './routes/_authorized/settings/profile/index';
import { Route as AuthorizedSettingsProfilePasswordChangeIndexImport } from './routes/_authorized/settings/profile/password/change/index';
import { Route as AuthorizedSettingsSystemIndexImport } from './routes/_authorized/settings/system/index';
import { Route as AuthorizedSettingsTranslationsLangIndexImport } from './routes/_authorized/settings/translations/$lang/index';
import { Route as AuthorizedSettingsTranslationsLangKeysCreateIndexImport } from './routes/_authorized/settings/translations/$lang/keys/create/index';
import { Route as AuthorizedSettingsUserRolesIndexImport } from './routes/_authorized/settings/user-roles/index';
import { Route as AuthorizedUsersUserIdIndexImport } from './routes/_authorized/users/$userId/index';
import { Route as AuthorizedUsersCreateIndexImport } from './routes/_authorized/users/create/index';
import { Route as AuthorizedUsersIndexImport } from './routes/_authorized/users/index';
import { Route as FinalizeRegistrationIndexImport } from './routes/finalize-registration/index';
import { Route as LoginIndexImport } from './routes/login/index';
import { Route as LogoutImport } from './routes/logout';
import { Route as ResetPasswordIndexImport } from './routes/reset-password/index';

// Create/Update Routes

const LogoutRoute = LogoutImport.update({
  path: '/logout',
  getParentRoute: () => rootRoute,
} as any);

const AuthorizedRoute = AuthorizedImport.update({
  id: '/_authorized',
  getParentRoute: () => rootRoute,
} as any);

const R404Route = R404Import.update({
  id: '/__404',
  getParentRoute: () => rootRoute,
} as any);

const ResetPasswordIndexRoute = ResetPasswordIndexImport.update({
  path: '/reset-password/',
  getParentRoute: () => rootRoute,
} as any);

const LoginIndexRoute = LoginIndexImport.update({
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any);

const FinalizeRegistrationIndexRoute = FinalizeRegistrationIndexImport.update({
  path: '/finalize-registration/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/finalize-registration/index.lazy').then((d) => d.Route)
);

const AuthorizedIndexRoute = AuthorizedIndexImport.update({
  path: '/',
  getParentRoute: () => AuthorizedRoute,
} as any);

const AuthorizedUsersIndexRoute = AuthorizedUsersIndexImport.update({
  path: '/users/',
  getParentRoute: () => AuthorizedRoute,
} as any).lazy(() =>
  import('./routes/_authorized/users/index.lazy').then((d) => d.Route)
);

const AuthorizedFilesIndexRoute = AuthorizedFilesIndexImport.update({
  path: '/files/',
  getParentRoute: () => AuthorizedRoute,
} as any).lazy(() =>
  import('./routes/_authorized/files/index.lazy').then((d) => d.Route)
);

const AuthorizedUsersCreateIndexRoute = AuthorizedUsersCreateIndexImport.update(
  {
    path: '/users/create/',
    getParentRoute: () => AuthorizedRoute,
  } as any
).lazy(() =>
  import('./routes/_authorized/users/create/index.lazy').then((d) => d.Route)
);

const AuthorizedUsersUserIdIndexRoute = AuthorizedUsersUserIdIndexImport.update(
  {
    path: '/users/$userId/',
    getParentRoute: () => AuthorizedRoute,
  } as any
).lazy(() =>
  import('./routes/_authorized/users/$userId/index.lazy').then((d) => d.Route)
);

const AuthorizedSettingsUserRolesIndexRoute =
  AuthorizedSettingsUserRolesIndexImport.update({
    path: '/settings/user-roles/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import('./routes/_authorized/settings/user-roles/index.lazy').then(
      (d) => d.Route
    )
  );

const AuthorizedSettingsSystemIndexRoute =
  AuthorizedSettingsSystemIndexImport.update({
    path: '/settings/system/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import('./routes/_authorized/settings/system/index.lazy').then(
      (d) => d.Route
    )
  );

const AuthorizedSettingsProfileIndexRoute =
  AuthorizedSettingsProfileIndexImport.update({
    path: '/settings/profile/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import('./routes/_authorized/settings/profile/index.lazy').then(
      (d) => d.Route
    )
  );

const AuthorizedFilesFileIdIndexRoute = AuthorizedFilesFileIdIndexImport.update(
  {
    path: '/files/$fileId/',
    getParentRoute: () => AuthorizedRoute,
  } as any
).lazy(() =>
  import('./routes/_authorized/files/$fileId/index.lazy').then((d) => d.Route)
);

const AuthorizedEntitiesModelIdIndexRoute =
  AuthorizedEntitiesModelIdIndexImport.update({
    path: '/entities/$modelId/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import('./routes/_authorized/entities/$modelId/index.lazy').then(
      (d) => d.Route
    )
  );

const AuthorizedSettingsTranslationsLangIndexRoute =
  AuthorizedSettingsTranslationsLangIndexImport.update({
    path: '/settings/translations/$lang/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import('./routes/_authorized/settings/translations/$lang/index.lazy').then(
      (d) => d.Route
    )
  );

const AuthorizedEntitiesSingletonsSingletonIdIndexRoute =
  AuthorizedEntitiesSingletonsSingletonIdIndexImport.update({
    path: '/entities/singletons/$singletonId/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import(
      './routes/_authorized/entities/singletons/$singletonId/index.lazy'
    ).then((d) => d.Route)
  );

const AuthorizedEntitiesModelIdCreateIndexRoute =
  AuthorizedEntitiesModelIdCreateIndexImport.update({
    path: '/entities/$modelId/create/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import('./routes/_authorized/entities/$modelId/create/index.lazy').then(
      (d) => d.Route
    )
  );

const AuthorizedEntitiesModelIdEntryIdIndexRoute =
  AuthorizedEntitiesModelIdEntryIdIndexImport.update({
    path: '/entities/$modelId/$entryId/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import('./routes/_authorized/entities/$modelId/$entryId/index.lazy').then(
      (d) => d.Route
    )
  );

const AuthorizedSettingsProfilePasswordChangeIndexRoute =
  AuthorizedSettingsProfilePasswordChangeIndexImport.update({
    path: '/settings/profile/password/change/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import(
      './routes/_authorized/settings/profile/password/change/index.lazy'
    ).then((d) => d.Route)
  );

const AuthorizedEntitiesModelIdEntryIdDuplicateIndexRoute =
  AuthorizedEntitiesModelIdEntryIdDuplicateIndexImport.update({
    path: '/entities/$modelId/$entryId/duplicate/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import(
      './routes/_authorized/entities/$modelId/$entryId/duplicate/index.lazy'
    ).then((d) => d.Route)
  );

const AuthorizedSettingsTranslationsLangKeysCreateIndexRoute =
  AuthorizedSettingsTranslationsLangKeysCreateIndexImport.update({
    path: '/settings/translations/$lang/keys/create/',
    getParentRoute: () => AuthorizedRoute,
  } as any).lazy(() =>
    import(
      './routes/_authorized/settings/translations/$lang/keys/create/index.lazy'
    ).then((d) => d.Route)
  );

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/__404': {
      preLoaderRoute: typeof R404Import;
      parentRoute: typeof rootRoute;
    };
    '/_authorized': {
      preLoaderRoute: typeof AuthorizedImport;
      parentRoute: typeof rootRoute;
    };
    '/logout': {
      preLoaderRoute: typeof LogoutImport;
      parentRoute: typeof rootRoute;
    };
    '/_authorized/': {
      preLoaderRoute: typeof AuthorizedIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/finalize-registration/': {
      preLoaderRoute: typeof FinalizeRegistrationIndexImport;
      parentRoute: typeof rootRoute;
    };
    '/login/': {
      preLoaderRoute: typeof LoginIndexImport;
      parentRoute: typeof rootRoute;
    };
    '/reset-password/': {
      preLoaderRoute: typeof ResetPasswordIndexImport;
      parentRoute: typeof rootRoute;
    };
    '/_authorized/files/': {
      preLoaderRoute: typeof AuthorizedFilesIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/users/': {
      preLoaderRoute: typeof AuthorizedUsersIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/entities/$modelId/': {
      preLoaderRoute: typeof AuthorizedEntitiesModelIdIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/files/$fileId/': {
      preLoaderRoute: typeof AuthorizedFilesFileIdIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/settings/profile/': {
      preLoaderRoute: typeof AuthorizedSettingsProfileIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/settings/system/': {
      preLoaderRoute: typeof AuthorizedSettingsSystemIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/settings/user-roles/': {
      preLoaderRoute: typeof AuthorizedSettingsUserRolesIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/users/$userId/': {
      preLoaderRoute: typeof AuthorizedUsersUserIdIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/users/create/': {
      preLoaderRoute: typeof AuthorizedUsersCreateIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/entities/$modelId/$entryId/': {
      preLoaderRoute: typeof AuthorizedEntitiesModelIdEntryIdIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/entities/$modelId/create/': {
      preLoaderRoute: typeof AuthorizedEntitiesModelIdCreateIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/entities/singletons/$singletonId/': {
      preLoaderRoute: typeof AuthorizedEntitiesSingletonsSingletonIdIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/settings/translations/$lang/': {
      preLoaderRoute: typeof AuthorizedSettingsTranslationsLangIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/entities/$modelId/$entryId/duplicate/': {
      preLoaderRoute: typeof AuthorizedEntitiesModelIdEntryIdDuplicateIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/settings/profile/password/change/': {
      preLoaderRoute: typeof AuthorizedSettingsProfilePasswordChangeIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
    '/_authorized/settings/translations/$lang/keys/create/': {
      preLoaderRoute: typeof AuthorizedSettingsTranslationsLangKeysCreateIndexImport;
      parentRoute: typeof AuthorizedImport;
    };
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  R404Route,
  AuthorizedRoute.addChildren([
    AuthorizedIndexRoute,
    AuthorizedFilesIndexRoute,
    AuthorizedUsersIndexRoute,
    AuthorizedEntitiesModelIdIndexRoute,
    AuthorizedFilesFileIdIndexRoute,
    AuthorizedSettingsProfileIndexRoute,
    AuthorizedSettingsSystemIndexRoute,
    AuthorizedSettingsUserRolesIndexRoute,
    AuthorizedUsersUserIdIndexRoute,
    AuthorizedUsersCreateIndexRoute,
    AuthorizedEntitiesModelIdEntryIdIndexRoute,
    AuthorizedEntitiesModelIdCreateIndexRoute,
    AuthorizedEntitiesSingletonsSingletonIdIndexRoute,
    AuthorizedSettingsTranslationsLangIndexRoute,
    AuthorizedEntitiesModelIdEntryIdDuplicateIndexRoute,
    AuthorizedSettingsProfilePasswordChangeIndexRoute,
    AuthorizedSettingsTranslationsLangKeysCreateIndexRoute,
  ]),
  LogoutRoute,
  FinalizeRegistrationIndexRoute,
  LoginIndexRoute,
  ResetPasswordIndexRoute,
]);

/* prettier-ignore-end */
