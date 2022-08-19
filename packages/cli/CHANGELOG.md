# @prom-cms/cli

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
