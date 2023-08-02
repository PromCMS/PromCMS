# @prom-cms/shared

## 1.9.4

### Patch Changes

- 988227f: Show human readable titles in admin

## 1.9.3

### Patch Changes

- 1a4a7c4: Update texting of error and add missing dependencies to cli package

## 1.9.2

### Patch Changes

- df425e2: Fix findGeneratorConfig, loadRootEnv, getEnvFilepath by not importing it dynamically but statically

## 1.9.1

### Patch Changes

- 9ce049f: Remove peer dependencies and fix post preset heading to be on main

## 1.9.0

### Minor Changes

- 999c46c: Add title and update columns structure to be map instead of plain object to maintain order.
- b61ac1d: Add new opening hours and repeater admin rendering type into json field type. Also add fieldType to file field type.

## 1.8.0

### Minor Changes

- 8dc8c0f: Implement singleton logic
- 8dc8c0f: Change the internals and implement different column admin layout logic which now is more logical and more abstract
- 8dc8c0f: Bring admin to packages and change buildsystem in development. Now its possible to be closer to real application with the benefit of live vite dev server of admin.

## 1.7.0

### Minor Changes

- f04b0c3: Add prompts to loggedJobWorker and add test to other packages.
- ebb67aa: Enable option for generating cms without admin as a CLI parameter

## 1.6.0

### Minor Changes

- c5bdfa2: Remove generation of core module.

## 1.5.0

### Minor Changes

- a551401: Add caching to file routes.
- 9589ec6: Move Views from root to scoping per module. Also add new shared utility removeDiacritics.

## 1.4.0

### Minor Changes

- 493a220: Get rid of SWR and custom services in admin and use tanstack/react-query and prom-cms/api-client instead
- 9b60d7c: Move translations from general json file per language to per-key translation to database

### Patch Changes

- 44fae0c: Fix build by updating prettier and applying to files

## 1.3.0

### Minor Changes

- 376ccbf: Make possibility to create model that can have internationalized fields
- 0ad043f: Move away from mysql based orm(eloquent) and replace it with SleekDB

## 1.2.0

### Minor Changes

- 286655f: Change build process to turbo and babel with tsup

## 1.1.0

### Minor Changes

- af4c577: Remove icons package since its not really necessary and replace it with direct tabler-icons-react

## 1.0.0

### Minor Changes

- 133ff38: Initial automatic release

### Patch Changes

- Updated dependencies [133ff38]
  - @prom-cms/icons@0.1.0
