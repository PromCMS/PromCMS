# @prom-cms/vite

## 0.3.2

### Patch Changes

- cd421cc: Fixes missing toString for url search params on encoded form data

## 0.3.1

### Patch Changes

- 015a05a: Fixes outdir to be correct path to public directory

## 0.3.0

### Minor Changes

- 5eeb00a: Adds a option to disable phpServer. Useful for using your own custom php server process.

## 0.2.1

### Patch Changes

- 59ffb7a: Fixes uploads on localhost
- 59ffb7a: Fixes development server and its proxy to php server, also it no longer does two requests when php server does not return 404
- 59ffb7a: Updates peer dependencies to allow vite v5

## 0.2.0

### Minor Changes

- 5ee3550: Disables logging for php development server

### Patch Changes

- 20a69e4: Updates vitest to latest
- 5ee3550: Changes packages manager from npm to pnpm
- 4b1f30b: Adds missing tsc-alias package
