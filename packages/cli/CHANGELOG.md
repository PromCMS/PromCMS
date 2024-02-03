# @prom-cms/cli

## 0.22.6

### Patch Changes

- a5b7bf0: Fixes package.json.ejs template

## 0.22.5

### Patch Changes

- de71dbc: Fixes json templates and wrongly missing quotes

## 0.22.4

### Patch Changes

- 1b08529: Fixes versions

## 0.22.3

### Patch Changes

- 20a69e4: Updates vitest to latest
- 5ee3550: Fixes template for starting prom-cms config
- 5ee3550: Changes packages manager from npm to pnpm
- Updated dependencies [f8acbd1]
- Updated dependencies [20a69e4]
- Updated dependencies [5ee3550]
- Updated dependencies [4b1f30b]
  - @prom-cms/schema@0.6.2

## 0.22.2

### Patch Changes

- 7e2944a: Updates php plugin and try catches formatting of a file to not stop generating a project. Formatting is not really mandatory
- Updated dependencies [7e2944a]
  - @prom-cms/prettier-config@0.1.1

## 0.22.1

### Patch Changes

- 803f384: Adds missing dependency "@prom-cms/schema"

## 0.22.0

### Minor Changes

- f912b6c: BREAKING: Adds validation of prom-cms/core minimal version.
- a735da6: BREAKING: Changes folder structure of output PromCMS instances. Previously each app had modules and functionality was defined into those separable pieces, but after usage reports it deemed to be unnecessary complexity. Newly each app has src where you strucure your php source code and there is src/frontend folder for frontend related javascript code.
- f912b6c: Updates composer.json template to include autoload for modules for imporoved usages of php use and namespaces
- f912b6c: BREAKING: Complete rewrite of internals to support new version of prom-core. This version uses propel as its corner stone for creating models and all things related to database in general. There are also new types and restructures between old packages and new packages.
- f912b6c: Adds htaccess with "deny from all". This should improve security even more
- f912b6c: BREAKING: Removes db group of commands entirely
- e1b38bd: BREAKING: Updates templates to support new routing, removes old templates and make development as default
- f912b6c: BREAKING: Use new commands from prom-core instead of in this repo as all thing related to managing application is placed in that and this cli serves as proxy for that

### Patch Changes

- f912b6c: Removes old vite plugin and config package and creates new @prom-cms/vite package containing everything related vite
- f912b6c: Update vite to latest v5
- bfc9af1: Fixes type definiions, schemas and components
- bb26014: Removes rimraf as that is not used anywhere
- Updated dependencies [f912b6c]
  - @prom-cms/prettier-config@0.1.0

## 0.21.6

### Patch Changes

- Updated dependencies [3bf57b1]
- Updated dependencies [d335fe2]
- Updated dependencies [852b797]
- Updated dependencies [2c81aa9]
- Updated dependencies [9ee9d53]
- Updated dependencies [87c21e9]
- Updated dependencies [1dae955]
- Updated dependencies [fb2915f]
  - @prom-cms/admin@0.17.0

## 0.21.5

### Patch Changes

- Updated dependencies [7687a35]
  - @prom-cms/admin@0.16.0

## 0.21.4

### Patch Changes

- Updated dependencies [db47c6c]
  - @prom-cms/admin@0.15.0

## 0.21.3

### Patch Changes

- Updated dependencies [803ad43]
- Updated dependencies [b91004a]
- Updated dependencies [2ad5366]
- Updated dependencies [5137fad]
- Updated dependencies [e4f7eaa]
- Updated dependencies [3545cb5]
- Updated dependencies [b047a2a]
  - @prom-cms/admin@0.14.0

## 0.21.2

### Patch Changes

- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
  - @prom-cms/admin@0.13.0

## 0.21.1

### Patch Changes

- acffe6f: Release fix for cli package. This release fixes incorrectly released package.

## 0.21.0

### Minor Changes

- 2fbdc3b: Extend admin settings into each model that now has hidden property that is by default false and property enabled that now controls model beviour from the point of admin and api.

### Patch Changes

- Updated dependencies [0c8e327]
- Updated dependencies [071f54f]
  - @prom-cms/admin@0.12.4

## 0.20.4

### Patch Changes

- 6fb5aaa: Fix project update command incorrectly generating models, by fixing passes path into module instead of models

## 0.20.3

### Patch Changes

- 25c9887: Fix project update command to take correct root module instead of root

## 0.20.2

### Patch Changes

- c27d058: Fix user actions by updating validate function as that validate must return true incase of success and false or string incase of fail.

  Furthermore create-project-module job should not format module name to lowercase.

- Updated dependencies [c27d058]
- Updated dependencies [c27d058]
- Updated dependencies [c27d058]
  - @prom-cms/admin@0.12.3
  - @prom-cms/config@0.1.7

## 0.20.1

### Patch Changes

- 04b3fc0: Update prettier and its plugins and also simplify overall structure of prettier config by removing config per project and creating one root config for entire repo
- 04b3fc0: Switch PHP version to version 8.2 in templates, config and Dockerfile
- Updated dependencies [04b3fc0]
- Updated dependencies [04b3fc0]
- Updated dependencies [04b3fc0]
  - @prom-cms/config@0.1.6
  - @prom-cms/admin@0.12.2

## 0.20.0

### Minor Changes

- d1d586c: Rework @prom-cms/cli and change api. This change also includes removal of @boost/cli and its parts. Now cli package uses inquirer and commander for managing cli interactions.

### Patch Changes

- 50a7cbf: Update documentation
- 50a7cbf: Remove schemas into new @prom-cms/schema package and update imports accordingly
- Updated dependencies [d1d586c]
- Updated dependencies [d1d586c]
- Updated dependencies [50a7cbf]
- Updated dependencies [50a7cbf]
  - @prom-cms/config@0.1.4
  - @prom-cms/admin@0.12.1

## 0.19.3

### Patch Changes

- Updated dependencies [56368ab]
  - @prom-cms/admin@0.12.0

## 0.19.2

### Patch Changes

- 1d16ebe: Add missing dependency "find-config" that has been missing

## 0.19.1

### Patch Changes

- Updated dependencies [e27be71]
  - @prom-cms/admin@0.11.0

## 0.19.0

### Minor Changes

- 6192a1e: Update user commands and add documentation. Also internally change build process for cli package from tsup to swc

### Patch Changes

- 2c9fe37: Fix missing psr/log dependency to still support 7.4 since we are are not yet ready for version 8

## 0.18.0

### Minor Changes

- ebcb8aa: Update user management commands. Now its possible to create, delete and change password on users.

## 0.17.2

### Patch Changes

- Updated dependencies [d0e8bcd]
- Updated dependencies [a1eec1a]
  - @prom-cms/admin@0.10.0

## 0.17.1

### Patch Changes

- Updated dependencies [5a41c92]
  - @prom-cms/admin@0.9.0

## 0.17.0

### Minor Changes

- b084ac9: Generate composer.json in new step instead if template each time which may delete previous contents

### Patch Changes

- Updated dependencies [b084ac9]
  - @prom-cms/admin@0.8.0

## 0.16.3

### Patch Changes

- Updated dependencies [2c511cf]
- Updated dependencies [18df648]
  - @prom-cms/admin@0.7.0

## 0.16.2

### Patch Changes

- 988227f: Show human readable titles in admin
- Updated dependencies [d3ea1ec]
- Updated dependencies [988227f]
- Updated dependencies [4e5e9fe]
  - @prom-cms/admin@0.6.0

## 0.16.1

### Patch Changes

- 16fa5d7: Fix cli by removing bangs from strings and update styling in admin
- Updated dependencies [16fa5d7]
- Updated dependencies [ab1a69c]
  - @prom-cms/admin@0.5.0

## 0.16.0

### Minor Changes

- 3285a89: Finish skip cli argument. Now it accepts ignore with \* or !<stepName> to include

### Patch Changes

- 1a4a7c4: Update texting of error and add missing dependencies to cli package
- Updated dependencies [1a4a7c4]
- Updated dependencies [a3ee34f]
- Updated dependencies [9e24657]
- Updated dependencies [c4341e7]
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

## 0.15.1

### Patch Changes

- 9ce049f: Fix prettier formatting in cli by using current config for cli package
- Updated dependencies [9ce049f]
- Updated dependencies [9ce049f]
- Updated dependencies [9ce049f]
  - @prom-cms/config@0.1.1
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

## 0.12.0

### Minor Changes

- f04b0c3: Add prompts to loggedJobWorker and add test to other packages.
- ebb67aa: Enable option for generating cms without admin as a CLI parameter

### Patch Changes

- Updated dependencies [f04b0c3]

## 0.11.0

### Minor Changes

- c5bdfa2: Remove generation of core module.
- 0dabd83: Add vite logic for development and production of resulted project

## 0.10.0

### Minor Changes

- 3503e4c: Add vite logic for development and production of resulted project

## 0.9.0

### Minor Changes

- a551401: Add caching to file routes.
- 9589ec6: Move Views from root to scoping per module. Also add new shared utility removeDiacritics.

### Patch Changes

- Updated dependencies [a551401]

## 0.8.0

### Minor Changes

- 493a220: Get rid of SWR and custom services in admin and use tanstack/react-query and prom-cms/api-client instead
- 9b60d7c: Move translations from general json file per language to per-key translation to database

### Patch Changes

- 44fae0c: Fix build by updating prettier and applying to files
- Updated dependencies [493a220]
- Updated dependencies [9b60d7c]

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

## 0.5.1

### Patch Changes

- 7273515: Fix cli by moving templates and php scripts to separate folder and fix that build not having esm files problem.

## 0.5.0

### Minor Changes

- 286655f: Change build process to turbo and babel with tsup

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
