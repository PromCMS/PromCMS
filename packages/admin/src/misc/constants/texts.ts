export const SIMPLE_WORDS = {
  LINK: 'Link',
  CONTENT: 'Content',
};

export const EDITOR_MESSAGES = {
  PLACEHOLDER_TITLE: 'What’s the title?',
  PLACEHOLDER_PARAGRAPH: 'Start writing here...',
  BOLD: 'Bold',
  ITALIC: 'Italic',
  BLOCKQUOTE: 'Blockquote',
  UNDO: 'Undo',
  REDO: 'Redo',
  CLEAR_ALL_FORMATTING: 'Clear all formatting',
  BULLET_LIST: 'Bullet list',
  ORDERED_LIST: 'Bullet list',
  HEADING_LEVEL_1: 'Heading level 1',
  HEADING_LEVEL_2: 'Heading level 2',
  HEADING_LEVEL_3: 'Heading level 3',
  HEADING_LEVEL_4: 'Heading level 4',
  HEADING_LEVEL_5: 'Heading level 5',
  HEADING_LEVEL_6: 'Heading level 6',
  TEXT_ALIGN_LEFT: 'Align left',
  TEXT_ALIGN_CENTER: 'Align center',
  TEXT_ALIGN_RIGHT: 'Align right',
  TEXT_ALIGN_JUSTIFY: 'Align justify',
  ENTER_YOUR_LINK: 'Enter your link',
};

export const MESSAGES = {
  ...SIMPLE_WORDS,
  ...EDITOR_MESSAGES,
  PREVIEW_CONTENT: 'Preview content',
  SHOW_SELECTED_ITEM: 'Show selected item',
  ON_DELETE_REQUEST_PROMPT: 'Are you sure you want to delete this item?',
  INVALID_OLD_PASSWORD: 'Your old password is invalid',
  ERROR_BASIC: 'An error happened',
  ARE_YOUR_REALLY_SURE: 'Are you really sure?',
  CHANGE_PASSWORD: 'Change password',
  NEW_PASSWORD: 'New password',
  NEW_PASSWORD_AGAIN: 'New password again',
  OLD_PASSWORD: 'Old password',
  WELCOME_USER: 'Welcome back, {{name}}',
  FILE_IS_SELECTED__WITH_NAME: 'File has been selected: {{filename}}',
  PLEASE_ENTER_PASSWORD: 'Please enter password',
  PLEASE_ENTER_EMAIL: 'Please enter email',
  PLEASE_ENTER_MFA_TOKEN: 'Please enter your token',
  MFA_TOKEN_SHORT: 'Your token is too short',
  ENTRY_ITEM_DUPLICATE: 'Are you sure you want to duplicate this item?',
  LOGIN_INVALID_CREDENTIALS: 'Wrong email or password',
  LOGIN_USER_BLOCKED: 'Looks like your account is blocked',
  LOGIN_USER_INVITED:
    'Looks like you did not finish registration. Please check your inbox.',
  LOGIN_USER_PASSWORD_RESET:
    'Looks like you did not finish password reset. Please check your inbox.',
  DUPLICATE_USER: 'User with this email already exists',
  FIELD_REQUIRED: 'This field is required',
  PLEASE_WAIT: 'Please wait...',
  PASSWORDS_MUST_MATCH: 'Passwords must match',
  TODAY_IS_DATE: 'Today is {{ date }}',
  PUBLISH_INFO: 'Publish info',
  STATE: 'State',
  SETTINGS: 'Settings',
  USER: 'User',
  CREATE_AN_USER: 'Create an user',
  UPDATE_AN_USER: 'Update an user',
  BLOCK_USER: 'Block user',
  SEND_PASS_RESET: 'Send password reset',
  ADD_CONTRIBUTOR_TEXT:
    'Add contributor and add permission to edit to some user',
  CONTRIBUTORS: 'Contributors',
  ADD_CONTRIBUTOR: 'Add contributor',
  USER_ROLES: 'User Roles',
  SYSTEM_SETTINGS: 'System settings',
  GENERAL_TRANSLATIONS: 'General translations',
  FOR_LANGUAGE: 'For language',
  EDIT: 'Upravit',
  CHOOSE_A_FILE: 'Choose a file',
  NAME: 'Name',
  CREATE_TRANSLATION_KEY: 'Create translation key',
  CREATE_TRANSLATION_KEY_VALUE_DESC:
    'This is a translation value for current language',
  PAGINATION_CONTENT: 'Showing {{from}} to {{to}} of {{total}} entries',
  NO_SELECTED_FILES: 'No selected files yet',
  NO_SELECTED_FILE: 'No selected file yet',
  VIEW_FILE: 'View file',
  EMPTY_VALUE: 'Empty value',
  MUST_BE_VALID_COLOR: 'Must be valid hexadecimal color',
  MUST_BE_VALID_EMAIL: 'Must be a valid email',
  MUST_BE_VALID_URL: 'Must be a valid url',
  CHOOSE: 'Choose',
  NOT_SELECTED: 'Not selected',
  SOME_TEXT: 'Some text',
  ACTION_ON_CLICK: 'Action on click',
  NO_ACTION: 'No action',
  OPEN_IN_NEW_TAB: 'Open in a new tab',
  DOWNLOAD: 'Download',
  LOGIN_TO_MY_ACCOUNT: 'Login to my account',
  SELECT: 'Select',

  UPLOADING: 'Uploading',
  UPLOADING_FILES: 'Uploading files...',
  STARTED_UPLOADING: 'Started uploading',
  ALL_FILES_HAS_BEEN_PROCESSED: 'All files has been processed',
  UPLOADING_FINISHED: 'Uploading Finished!',
  UPLOADING_FAILED: 'Uploading Failed!',
  FILE_CANNOT_BE_UPLOADED: '{{fileName}} cannot be uploaded!',
  FILE_TOO_LARGE: '{{fileName}} is too large!',
  FILE_EXTENSION_UNSUPPORTED: '{{extension}} is not supported!',
} as const;
