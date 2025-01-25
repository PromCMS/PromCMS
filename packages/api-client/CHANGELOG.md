# @prom-cms/api-client

## 0.17.0

### Minor Changes

- 7178caa: Extents possible manipulator for where query param on requests.
- ec6f84c: Introduces handlers for maintanance routes. They are accessible in your api clients under apiclient -> settings object by maintanance

### Patch Changes

- a3c44b5: Fixes used local versions as dependencies
- a3c68e1: Fixes incorrect implemention of update for file metadata
- ebc2ebf: Uses latest pnpm which manages updating local package versions after release
- d8219c6: Fixes invalid assertion for formatting countdown
- Updated dependencies [a3c44b5]
- Updated dependencies [0227ca8]
- Updated dependencies [f3ed05c]
- Updated dependencies [11af6a4]
- Updated dependencies [ebc2ebf]
- Updated dependencies [0227ca8]
  - @prom-cms/schema@0.12.0

## 0.15.2

### Patch Changes

- Updated dependencies [33b13d6]
  - @prom-cms/schema@0.10.0

## 0.15.1

### Patch Changes

- 9b07a92: Fixes incorrect url for fetching localizations

## 0.15.0

### Minor Changes

- 7d0087c: BREAKING: Fixes and removes incorrect handler methods. Updates and creates of localization keys should be done through upsert

## 0.14.1

### Patch Changes

- Updated dependencies [3640751]
  - @prom-cms/schema@0.9.0

## 0.14.0

### Minor Changes

- c1b2afc: Fixes base url definitions and exposes AppConfig type

### Patch Changes

- Updated dependencies [2b9fa49]
  - @prom-cms/schema@0.8.0

## 0.13.0

### Minor Changes

- 2abb38e: Fixes type declarations and exposes Entity type that specifies standard entity.

### Patch Changes

- Updated dependencies [2abb38e]
  - @prom-cms/schema@0.7.0

## 0.12.0

### Minor Changes

- 59ffb7a: Adds new method `me` for getting current logged in user

## 0.11.1

### Patch Changes

- 5ee3550: Changes packages manager from npm to pnpm
- 4b1f30b: Adds missing tsc-alias package
- Updated dependencies [f8acbd1]
- Updated dependencies [20a69e4]
- Updated dependencies [5ee3550]
- Updated dependencies [4b1f30b]
  - @prom-cms/schema@0.6.2

## 0.11.0

### Minor Changes

- f912b6c: BREAKING: Complete rewrite of internals to support new version of prom-core. This version uses propel as its corner stone for creating models and all things related to database in general. There are also new types and restructures between old packages and new packages.
- e1b38bd: Updates api client to match latest api implementation

### Patch Changes

- Updated dependencies [f912b6c]
- Updated dependencies [f912b6c]
- Updated dependencies [f912b6c]
- Updated dependencies [e1b38bd]
  - @prom-cms/schema@0.6.0

## 0.10.0

### Minor Changes

- 7687a35: Add support for 415 and 413 status code when uploading files fails. This helps user understand more on what happened on server during failed uploads.

## 0.9.0

### Minor Changes

- 5137fad: POSSIBLE BREAKING: Added `unstable_fetchReferences` property to each request config in api-client and uses this property in admin useModelItems and columnValueFormatter so its accessible with the use of labelConstructor.
- 5137fad: Adds new property to result item as each result can have this property when combined with specific query parameter.

## 0.8.0

### Minor Changes

- 415628e: Add new utility types for error codes that come from API.

### Patch Changes

- 0c8e327: Update vite to latest and axios to 0.27 and add missing dependency on axios to admin package.

## 0.7.1

### Patch Changes

- 50a7cbf: Update documentation
- Updated dependencies [d1d586c]
- Updated dependencies [d1d586c]
- Updated dependencies [50a7cbf]

## 0.7.0

### Minor Changes

- b084ac9: Implement password-reset into admin and api client

## 0.6.0

### Minor Changes

- 999c46c: Add title and update columns structure to be map instead of plain object to maintain order.
- b61ac1d: Add new opening hours and repeater admin rendering type into json field type. Also add fieldType to file field type.

### Patch Changes

- Updated dependencies [999c46c]

## 0.5.0

### Minor Changes

- 8dc8c0f: Implement singleton logic
- 8dc8c0f: Change the internals and implement different column admin layout logic which now is more logical and more abstract

### Patch Changes

- Updated dependencies [8dc8c0f]
- Updated dependencies [8dc8c0f]

## 0.4.1

### Patch Changes

- ebb67aa: Enable option for generating cms without admin as a CLI parameter
- Updated dependencies [f04b0c3]

## 0.4.0

### Minor Changes

- a551401: Add caching to file routes.

### Patch Changes

- Updated dependencies [a551401]

## 0.3.0

### Minor Changes

- 493a220: Get rid of SWR and custom services in admin and use tanstack/react-query and prom-cms/api-client instead
- 9b60d7c: Move translations from general json file per language to per-key translation to database

### Patch Changes

- 44fae0c: Fix build by updating prettier and applying to files
- Updated dependencies [493a220]
- Updated dependencies [9b60d7c]

## 0.2.0

### Minor Changes

- 286655f: Change build process to turbo and babel with tsup

## 0.1.0

### Minor Changes

- 133ff38: Initial automatic release
