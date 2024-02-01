# @prom-cms/schema

## 0.6.1

### Patch Changes

- 5c64bd3: Moves dependency tabler-icons-react to normal dependencies as that is used during runtime

## 0.6.0

### Minor Changes

- f912b6c: BREAKING: New required properties under database - "connections". Connections are specifications for connection to database inside your app. Each specification of connection can be granullary specified for each database (lets say you have two tables and each of one lives in different database). Also big new thing is removing keys of database tables/singletons/models and columns. Now keys can be defined in table and column item . This improves predicability of order in which are columns and tables created
- f912b6c: BREAKING: Complete rewrite of internals to support new version of prom-core. This version uses propel as its corner stone for creating models and all things related to database in general. There are also new types and restructures between old packages and new packages.
- e1b38bd: BREAKING: Updates schema to have some security properties required and includes default tables inside models

### Patch Changes

- f912b6c: Removes old vite plugin and config package and creates new @prom-cms/vite package containing everything related vite

## 0.5.0

### Minor Changes

- 9ee9d53: Adds wysiwyg editor for longText field type. This editor is created with the help of awesome TipTap library

## 0.4.0

### Minor Changes

- db47c6c: Add support for relationship field in repeater

## 0.3.0

### Minor Changes

- d7e0891: Add new admin.fieldType "color" for "repeater" column type
- d7e0891: Add new column type "email"
- d7e0891: Adds description into column base schema. This is used not only in admin under each field but also in database if that is supported.
- d7e0891: Add linkButton to json column type
- d7e0891: Adds readonly to all column types. If true, column data are ommited from update. In admin the field is rendered but is disabled
- d7e0891: Implement width of each field for admin
- d7e0891: Adds new column type URL
- d7e0891: Adds min and max option for nubmer schema to control inputs to number column even more

## 0.2.1

### Patch Changes

- 0bb8014: Fix incorrectly made property non static for model.

## 0.2.0

### Minor Changes

- 2fbdc3b: Extend admin settings into each model that now has hidden property that is by default false and property enabled that now controls model beviour from the point of admin and api.

## 0.1.0

### Minor Changes

- 50a7cbf: Create package

### Patch Changes

- 50a7cbf: Update documentation

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
