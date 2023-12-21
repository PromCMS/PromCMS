# @prom-cms/admin

## 0.17.2

### Patch Changes

- 2c7e03d: Fix RelationshipItemSelect not taking full width and repeater field showing empty fields on readonly. Now it shows just message to let user know that its empty.

## 0.17.1

### Patch Changes

- 0c0ff85: Updates styling of title field so underline is red when field has error
- 0c0ff85: Prevents navigation of user to login page when booting request is canceled

## 0.17.0

### Minor Changes

- 852b797: Wrap entire app with suspense and allow useCurrentModelItem to throw suspense. Also update entry underpage to show 404 when entry is not found.
- 9ee9d53: Adds wysiwyg editor for longText field type. This editor is created with the help of awesome TipTap library
- 1dae955: Allows user to go to linked item from relationship field

### Patch Changes

- 3bf57b1: Get rid of ugly implementation of getEntryUnderPageComponent and update it to be more reacty. This is also preparation for rewrite.
- d335fe2: Show entire image instead of allowing image to scale to parent size for image fields.
- 2c81aa9: Update localizations for czech language and allow germany + slovak language in admin language select
- 87c21e9: Allow users to preview content from longText even from list
- fb2915f: Bugfix inifinite rerender and add czech localizations.
- Updated dependencies [9ee9d53]
  - @prom-cms/schema@0.5.0

## 0.16.0

### Minor Changes

- 7687a35: Show user that file upload failed and why to help user understand why their file upload has failed.

### Patch Changes

- Updated dependencies [7687a35]
  - @prom-cms/api-client@0.10.0

## 0.15.1

### Patch Changes

- a94dce5: Fix admin when relation does not exist it throws when rendering mustache by bypassing rendering altogether
- 83dd3ec: Fix admin not rendering action on repeater json field when readonly is true

## 0.15.0

### Minor Changes

- db47c6c: Add support for relationship field in repeater

### Patch Changes

- Updated dependencies [db47c6c]
  - @prom-cms/schema@0.4.0

## 0.14.0

### Minor Changes

- b91004a: Possible Breaking: Introduces different image picker to image and file components. Now there is a slideover that shows classic file library that is from file library page. Changes made to file library page will reflect changes made to file picker view from slideover.
- 2ad5366: BREAKING: labelConstructor under relationship column will now support mustache templating in admin.
- 5137fad: POSSIBLE BREAKING: Added `unstable_fetchReferences` property to each request config in api-client and uses this property in admin useModelItems and columnValueFormatter so its accessible with the use of labelConstructor.

### Patch Changes

- 803ad43: Fixing column value formatter for table view to not use error boundary for relations and if there is an error the show X icon
- e4f7eaa: Redirect user out of login when he is already logged in.
- 3545cb5: Update design of login page and improve loading screen.
- b047a2a: Hide action buttons for repeater column render of json field
- Updated dependencies [2ad5366]
- Updated dependencies [5137fad]
- Updated dependencies [5137fad]
  - @prom-cms/api-client@0.9.0

## 0.13.0

### Minor Changes

- d7e0891: Add linkButton to json column type
- d7e0891: Implement width of each field for admin

### Patch Changes

- d7e0891: Update admin according to new schema changes and support new column types
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
- Updated dependencies [d7e0891]
  - @prom-cms/schema@0.3.0

## 0.12.6

### Patch Changes

- a51ee57: Implement logging on admin for developers to debug on unwanted behavior. This logs are always attached to window.application.logs property and can also be projected into console itself when `debug` search param is present in current url. This logging is used for when entry form is being validated.

## 0.12.5

### Patch Changes

- 907154e: Filter out hidden or disabled models in site context so user does not get shown any models that should not be shown visually as they might not work through admin.

## 0.12.4

### Patch Changes

- 0c8e327: Update vite to latest and axios to 0.27 and add missing dependency on axios to admin package.
- 071f54f: Fix typings and usages of axios to use new utility types for error codes
- Updated dependencies [415628e]
- Updated dependencies [0c8e327]
- Updated dependencies [2fbdc3b]
  - @prom-cms/api-client@0.8.0
  - @prom-cms/schema@0.2.0

## 0.12.3

### Patch Changes

- c27d058: Fix admin system-settings by using useFieldArray for lists view
- c27d058: Fix local development by using startPHPServer from vite-plugin package inside admin and updating commands. Now this startPHPServer is exported from vite-plugin package

## 0.12.2

### Patch Changes

- 04b3fc0: Update prettier and its plugins and also simplify overall structure of prettier config by removing config per project and creating one root config for entire repo

## 0.12.1

### Patch Changes

- 50a7cbf: Update documentation
- 50a7cbf: Remove schemas into new @prom-cms/schema package and update imports accordingly
- Updated dependencies [d1d586c]
- Updated dependencies [d1d586c]
- Updated dependencies [50a7cbf]
- Updated dependencies [50a7cbf]
- Updated dependencies [50a7cbf]
  - @prom-cms/api-client@0.7.1
  - @prom-cms/schema@0.1.0

## 0.12.0

### Minor Changes

- 56368ab: Ask user on system settings delete to prevent unwanted deletions

## 0.11.0

### Minor Changes

- e27be71: Udpate admin stylings

## 0.10.0

### Minor Changes

- d0e8bcd: Add own logo to admin and site icon.
- a1eec1a: Update file inputs to select files instead of just images

## 0.9.1

### Patch Changes

- 586f96a: Apply some fixes to admin: do not render coeditors field, because its handled in aside + fix menu that shows zero when there are no items in group

## 0.9.0

### Minor Changes

- 5a41c92: Improve czech language admin translations

## 0.8.0

### Minor Changes

- b084ac9: Implement password-reset into admin and api client

### Patch Changes

- Updated dependencies [b084ac9]
  - @prom-cms/api-client@0.7.0

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

## 0.3.2

### Patch Changes

- a321765: Fix admin repeater columns, small field select pager not working and uploader placeholder file uploader.

## 0.3.1

### Patch Changes

- 9ce049f: Update admin package exports to only export dist folder

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
