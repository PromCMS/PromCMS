# @prom-cms/admin

## 0.7.0

### Minor Changes

- 2c511cf: Update localization logic in admin and add default language packs.
- 18df648: Add functionality to reset password through logged in admin

## 0.6.0

### Minor Changes

- 988227f: Show human readable titles in admin
- 4e5e9fe: Change input to textarea in admin translation page.

### Patch Changes

- d3ea1ec: Fix some react errors and fix bugs with editorjs on language change.
- Updated dependencies [988227f]
  - @prom-cms/shared@1.9.4

## 0.5.0

### Minor Changes

- ab1a69c: Button link now allows any string in url

### Patch Changes

- 16fa5d7: Fix cli by removing bangs from strings and update styling in admin

## 0.4.0

### Minor Changes

- a3ee34f: Make quality higher on images, add ordering when model has timestamps and fix margins on singleton page.
- 9e24657: Add quote block
- c4341e7: Update block tunes and add aligns of text

### Patch Changes

- Updated dependencies [1a4a7c4]
  - @prom-cms/shared@1.9.3

## 0.3.2

### Patch Changes

- a321765: Fix admin repeater columns, small field select pager not working and uploader placeholder file uploader.

## 0.3.1

### Patch Changes

- 9ce049f: Update admin package exports to only export dist folder
- Updated dependencies [9ce049f]
  - @prom-cms/shared@1.9.1

## 0.3.0

### Minor Changes

- dfee4be: Release admin into npm and do not build it in cli - just copy it.
- 2751c2a: Do not resolve admin package - just resolve folder manually

## 0.2.0

### Minor Changes

- 999c46c: Add title and update columns structure to be map instead of plain object to maintain order.
- b61ac1d: Add new opening hours and repeater admin rendering type into json field type. Also add fieldType to file field type.

### Patch Changes

- Updated dependencies [999c46c]
- Updated dependencies [b61ac1d]
  - @prom-cms/api-client@0.6.0
  - @prom-cms/shared@1.9.0

## 0.1.0

### Minor Changes

- 8dc8c0f: Implement singleton logic
- 8dc8c0f: Change the internals and implement different column admin layout logic which now is more logical and more abstract
- 8dc8c0f: Bring admin to packages and change buildsystem in development. Now its possible to be closer to real application with the benefit of live vite dev server of admin.

### Patch Changes

- Updated dependencies [8dc8c0f]
- Updated dependencies [8dc8c0f]
- Updated dependencies [8dc8c0f]
  - @prom-cms/api-client@0.5.0
  - @prom-cms/shared@1.8.0
