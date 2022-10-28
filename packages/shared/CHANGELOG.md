# @prom-cms/shared

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
