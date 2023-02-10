# @prom-cms/cli

## 0.16.0

### Minor Changes

- 3285a89: Finish skip cli argument. Now it accepts ignore with \* or !<stepName> to include

### Patch Changes

- 1a4a7c4: Update texting of error and add missing dependencies to cli package
- Updated dependencies [1a4a7c4]
- Updated dependencies [a3ee34f]
- Updated dependencies [9e24657]
- Updated dependencies [c4341e7]
  - @prom-cms/shared@1.9.3
  - @prom-cms/admin@0.4.0

## 0.15.6

### Patch Changes

- a321765: Fix seeder
- Updated dependencies [a321765]
  - @prom-cms/admin@0.3.2

## 0.15.5

### Patch Changes

- 897e7a4: Dynamic import prettier config and update plugins on prettier config
- Updated dependencies [897e7a4]
  - @prom-cms/config@0.1.2

## 0.15.4

### Patch Changes

- 7904da1: Preserve folder structure on build in cli package

## 0.15.3

### Patch Changes

- af28315: Do not load env variables at the start of cli and only load when necessary

## 0.15.2

### Patch Changes

- df425e2: Fix findGeneratorConfig, loadRootEnv, getEnvFilepath by not importing it dynamically but statically
- Updated dependencies [df425e2]
  - @prom-cms/shared@1.9.2

## 0.15.1

### Patch Changes

- 9ce049f: Fix prettier formatting in cli by using current config for cli package
- Updated dependencies [9ce049f]
- Updated dependencies [9ce049f]
- Updated dependencies [9ce049f]
  - @prom-cms/config@0.1.1
  - @prom-cms/shared@1.9.1
  - @prom-cms/admin@0.3.1

## 0.15.0

### Minor Changes

- dfee4be: Release admin into npm and do not build it in cli - just copy it.
- 2751c2a: Do not resolve admin package - just resolve folder manually

### Patch Changes

- Updated dependencies [dfee4be]
- Updated dependencies [2751c2a]
  - @prom-cms/admin@0.3.0

## 0.14.0

### Minor Changes

- b61ac1d: Add new opening hours and repeater admin rendering type into json field type. Also add fieldType to file field type.

### Patch Changes

- Updated dependencies [999c46c]
- Updated dependencies [b61ac1d]
  - @prom-cms/shared@1.9.0

## 0.13.0

### Minor Changes

- 8dc8c0f: Implement singleton logic
- 8dc8c0f: Add new optional cli params - skip to skip some parts and packageManager to preselect desired package manager
- 8dc8c0f: Change the internals and implement different column admin layout logic which now is more logical and more abstract
- eb0c988: Create a new command users to manage users
- 8dc8c0f: Bring admin to packages and change buildsystem in development. Now its possible to be closer to real application with the benefit of live vite dev server of admin.
- 370a749: Fix invalid file loading of module and remove some cli parameters

### Patch Changes

- Updated dependencies [8dc8c0f]
- Updated dependencies [8dc8c0f]
- Updated dependencies [8dc8c0f]
  - @prom-cms/shared@1.8.0

## 0.12.0

### Minor Changes

- f04b0c3: Add prompts to loggedJobWorker and add test to other packages.
- ebb67aa: Enable option for generating cms without admin as a CLI parameter

### Patch Changes

- Updated dependencies [f04b0c3]
- Updated dependencies [ebb67aa]
  - @prom-cms/shared@1.7.0

## 0.11.0

### Minor Changes

- c5bdfa2: Remove generation of core module.
- 0dabd83: Add vite logic for development and production of resulted project

### Patch Changes

- Updated dependencies [c5bdfa2]
  - @prom-cms/shared@1.6.0

## 0.10.0

### Minor Changes

- 3503e4c: Add vite logic for development and production of resulted project

## 0.9.0

### Minor Changes

- a551401: Add caching to file routes.
- 9589ec6: Move Views from root to scoping per module. Also add new shared utility removeDiacritics.

### Patch Changes

- Updated dependencies [a551401]
- Updated dependencies [9589ec6]
  - @prom-cms/shared@1.5.0

## 0.8.0

### Minor Changes

- 493a220: Get rid of SWR and custom services in admin and use tanstack/react-query and prom-cms/api-client instead
- 9b60d7c: Move translations from general json file per language to per-key translation to database

### Patch Changes

- 44fae0c: Fix build by updating prettier and applying to files
- Updated dependencies [493a220]
- Updated dependencies [9b60d7c]
- Updated dependencies [44fae0c]
  - @prom-cms/shared@1.4.0

## 0.7.0

### Minor Changes

- 8339990: Use prom-cms/core package and remove app folder
- 8339990: Remove namespace from models classes

## 0.6.0

### Minor Changes

- 7735342: Use dynamic localizations from json
- 376ccbf: Make possibility to create model that can have internationalized fields
- b5687f3: Simplify admin by replacing nextjs with more fitting vite
- 25944c2: Use prom-cms/core package and remove app folder
- 0ad043f: Move away from mysql based orm(eloquent) and replace it with SleekDB

### Patch Changes

- Updated dependencies [376ccbf]
- Updated dependencies [0ad043f]
  - @prom-cms/shared@1.3.0

## 0.5.1

### Patch Changes

- 7273515: Fix cli by moving templates and php scripts to separate folder and fix that build not having esm files problem.

## 0.5.0

### Minor Changes

- 286655f: Change build process to turbo and babel with tsup

### Patch Changes

- Updated dependencies [286655f]
  - @prom-cms/shared@1.2.0

## 0.4.1

### Patch Changes

- 2ca5919: Fix cli options. Move configPath formatter to command body.

## 0.4.0

### Minor Changes

- e046c42: Remove core from apps and make cli create core from templates

### Patch Changes

- a0ffe17: Move apps to apps folder

## 0.3.0

### Minor Changes

- 8606ad2: Add new command sync-database to make tables by eloquent and allow passing project root to each command that cli provides. Add support for json PromCMS config file.

## 0.2.0

### Minor Changes

- 4432792: Tweak some things in cli to make it working

## 0.1.3

### Patch Changes

- 27725c3: Add missing type:module

## 0.1.2

### Patch Changes

- 78b000d: Fix cli by renaming the bin file extension from js to cjs and renaming the imported esm file.

## 0.1.1

### Patch Changes

- aa06eb8: Fix cli by running esm version of package in bin.

## 0.1.0

### Minor Changes

- 133ff38: Initial automatic release

### Patch Changes

- Updated dependencies [133ff38]
  - @prom-cms/shared@1.0.0
