import { MESSAGES } from './texts';

export const localizationLocalStorageKey = 'i18nextLng';
export const localizationSessionStorageKey = 'i18nextLng';
export const localizationCookieStorageKey = 'i18nextLng';

export const defaultKeys = {
  Empty: 'Empty',
  // TODO: No items available
  'No items yet...': 'No items yet...',
  'Loading, please wait...': 'Loading, please wait...',
  'Other info': 'Other info',
  'Title here...': 'Title here...',
  Yes: 'Yes',
  No: 'No',
};

export type TranslationKeys = keyof typeof defaultKeys;

export const defaultLanguagePacks = {
  cs: {
    translation: {
      Empty: 'Prázdné',
      // TODO: No items available
      'No items yet...': 'Zatím žádné položky...',
      'Loading, please wait...': 'Načítám, strpení prosím...',
      'Other info': 'Ostatní informace',
      'Title here...': 'Název...',
      Yes: 'Ano',
      No: 'Ne',
      'Select an option': 'Vyberte',
      'Choose an image': 'Vybrat obrázek',
      [MESSAGES.CHOOSE_A_FILE]: 'Vybrat soubor',
      [MESSAGES.NAME]: 'Název',
      [MESSAGES.NO_SELECTED_FILES]: 'Nebyly zatím vybrány žádné soubory',
      [MESSAGES.NO_SELECTED_FILE]: 'Nebyl zatím vybrán žádný soubor',
      'Change image': 'Změnit obrázek',
      'Set image': 'Nastavit obrázek',
      From: 'Od',
      'Pick time': 'Vybrat čas',
      To: 'Do',
      Files: 'Soubory',
      Closed: 'Zavřeno',
      Monday: 'Pondělí',
      Tuesday: 'Úterý',
      Wednesday: 'Středa',
      Thursday: 'Čtvrtek',
      Friday: 'Pátek',
      Saturday: 'Sobota',
      Sunday: 'Neděle',
      Actions: 'Akce',
      'Add new': 'Přidat nový',
      'Your filename, id, description...': 'Název souboru, id, popisek...',
      Change: 'Změnit',
      Default: 'Základní',
      Language: 'Jazyk',
      'Start typing to see options': 'Začněte psát pro vyhledání',
      'Nothing has been found': 'Nic nebylo nalezeno',
      'Align left': 'Zarovnat vlevo',
      'Align center': 'Zarovnat na střed',
      'Align right': 'Zarovnat doprava',
      'Loading editor, please wait...': 'Načítám editor, strpení prosím...',
      'Start typing here...': 'Začněte psát zde...',
      'Enter a quote': 'Zadejte citát',
      "Quote's author": 'Autor citátu',
      Columns: 'Sloupce',
      'Button link': 'Tlačítko jako odkaz',
      Link: 'Odkaz',
      'Invalid url': 'Invalidní URL adresa',
      Label: 'Štítek',
      'Some text': 'Nějaký text',
      'Download on button click': 'Stáhnout při kliknutí na odkaz',
      'Open on new tab': 'Otevřít v nové záložce',
      'Placeholder Image': 'Obrázek místo textu',
      'Dynamic block': 'Dynamický blok',
      'Dynamic block identifier': 'Označení dynamického bloku',
      'Select new image': '',
      Title: 'Titulek',
      Description: 'Popis',
      'Gallery name': 'Název galerie',
      'Change metadata': 'Změnit doplňkové informace',
      'Add column': 'Přidat sloupec',
      'Remove column': 'Odebrat sloupec',
      'Really remove?': 'Opravdu odstranit?',
      Tags: 'Štítky',
      'No tags, start by adding some': 'Zatím žádné štítky...',
      'New badge name': 'Nový název štítku',
      Duplicate: 'Duplikovat',
      [MESSAGES.EDIT]: 'Upravit',
      Delete: 'Odstranit',
      items: 'položky',
      Settings: 'Nastavení',
      Users: 'Uživatelé',
      Profile: 'Profil',
      'Log in': 'Přihlásit se',
      'Log off': 'Odhlásit se',
      "It appears that you're not online, try again later...":
        'Vypadát to, že nejste připojeni k internetu. Zkontrolujte vaše připojení a zkuste to znovu.',
      'Task completed successfully': 'Akce dokončena',
      'An error happened': 'Stala se neočekávaná chyba',
      'Go home': 'Jít domů',
      'Logging you out...': 'Odhlašuji...',
      'This model with this id does not exist.':
        'Tento model s tímto názvem neexistuje',
      'Add new entry': 'Přidat položku',
      'Updating your entry, please wait...':
        'Ukládám úpravy, strpení prosím...',
      'Creating new entry, please wait...':
        'Vytvářím novou položku, strpení prosím...',
      'Your entry is created!': 'Položka úspěšně vytvořena!',
      'Your entry is updated!': 'Položka úspěšně upravena!',
      'This field is unique and other entry has the same value':
        'Tento řádek je unikátní a již existuje položka s touto hodnotou',
      'Entry types': 'Typy položek',
      Update: 'Upravit',
      Create: 'Vytvořit',
      Internationalization: 'Internacionalizace',
      Me: 'Já',
      'Publish info': 'Informace',
      'Updated at': 'Upraveno v',
      'Not edited yet': 'Zatím neupraveno',
      'Created at': 'Vytvořeno v',
      'Updated by': 'Upravil',
      'Created by': 'Vytvořil',
      'Select user': 'Vybrat uživatele',
      Cancel: 'Zrušit',
      'Toggle more options': 'Vybrat více možností',
      'Update an entry': 'Upravit položku',
      'Create an entry': 'Vytvořit položku',
      'Working...': 'Pracuji...',
      'Uploading files...': 'Nahrávám soubory...',
      'An error happened...': 'Stala se neočekávaná chyba',
      Success: 'Úspěch',
      'All files has been uploaded': 'Všechny soubory byly úspěšně nahrány',
      'Deleting folder': 'Mazám složku',
      'Do you really want to delete this folder?':
        'Opravdu chcete vymazat tuto složku?',
      'Your folder has been deleted': 'Složka byla vymazána',
      'This folder is not empty! Delete its contents first':
        'Tato složka není prázdná! Odstraňte prvně jejich položky',
      'An unexpected error happened': 'Stala se neočekávaná chyba',
      'Do you really want to delete this file?': 'Jste si opravdu jistí?',
      'Add new file': 'Přidat nový soubor',
      'Add new folder': 'Přidat novou složku',
      'Drag your files here here': 'Pusťte vaše soubory zde',
      Close: 'Zavřít',
      'File preview': 'Náhled souboru',
      'File URL': 'Adresa souboru',
      'Link copied!': 'Adresa zkopírována!',
      'Copy link to clipboard': 'Zkopírovat adresu',
      Welcome: 'Vítejte',
      'Your new password': 'Vaše nové heslo',
      'Your new password again': 'Vaše nové heslo znovu',
      Send: 'Odeslat',
      'Login to my account': 'Přihlásit se do mého účtu',
      Email: 'Email',
      Password: 'Heslo',
      'Forgot password?': 'Zapomenuté heslo',
      'Reset password': 'Resetovat heslo',
      'Create a new password': 'Vytvořit nové heslo',
      'We are done here! You can login again and continue with your work.':
        'Hotovo! Nyní se můžete znovu přihlásit...',
      'Back to login': 'Zpět na přihlášení',
      Save: 'Uložit',
      Slug: 'Zkratka',
      Value: 'Hodnota',
      'Option deleted!': 'Možnost odstraněna',
      'Deleting selected option, please wait...':
        'Odstraňuji vybrané položky, strpení prosím...',
      'Please wait...': 'Strpení prosím...',
      'Option successfully updated': 'Možnost úspěšně odstraněna',
      'Option has been created': 'Možnost byla vytvořena',
      Items: 'Položky',
      'No items for now': 'Zatím žádné položky',
      Copied: 'Zkopírováno',
      Updating: 'Upravuji',
      'Updating your data, please wait': 'Upravuji data, prosím strpení...',
      'Update done!': 'Úspěšně upraveno!',
      'Full name': 'Plné jméno',
      'Change email': 'Změnit heslo',
      'Admin language': 'Heslo rozhraní',
      'Saving, please wait...': 'Ukládám změny, strpení prosím...',
      'Key translated!': 'Klíč přeložen',
      'Key deleted!': 'Klíč odstraněn',
      'Translations key': 'Klíče překladu',
      'Translations value': 'Hodnota překladu',
      'Creating translation key': 'Vytvářím nový klíč překladu',
      'Translation key successfully created':
        'Nový klíč překladu úspěšně vytvořen',
      'Key title': 'Titulek klíče',
      'This field is required': 'Toto políčko je povinné',
      'Updating, please wait...': 'Ukládám změny, strpení prosím...',
      'Clearing successful!': 'Obsah jednotky vymazán!',
      'Clearing singleton...': 'Vymazávám jednotku...',
      Singletons: 'Jednotky',
      'Too short, minimum 6 characters': 'Minimum 6 znaků',
      'New password again': 'Nové heslo znovu',
      'Created at:': 'Vytvořeno v',
      [MESSAGES.PASSWORDS_MUST_MATCH]: 'Hesla se musí shodovat',
      [MESSAGES.INVALID_OLD_PASSWORD]: 'Zadané staré heslo není platné',
      [MESSAGES.WELCOME_USER]: 'Vítejte zpět, {{ name }}!',
      [MESSAGES.FILE_IS_SELECTED__WITH_NAME]:
        'Byl vybrán soubor: {{ filename }}',
      [MESSAGES.TODAY_IS_DATE]: 'Dnes je {{ date }}',
      [MESSAGES.CHANGE_PASSWORD]: 'Změnit heslo',
      [MESSAGES.NEW_PASSWORD]: 'Nové heslo',
      [MESSAGES.OLD_PASSWORD]: 'Staré heslo',
      [MESSAGES.STATE]: 'Stav',
      [MESSAGES.CREATE_AN_USER]: 'Vytvořit uživatele',
      [MESSAGES.UPDATE_AN_USER]: 'Upravit uživatele',
      [MESSAGES.BLOCK_USER]: 'Zablokovat uživatele',
      [MESSAGES.SEND_PASS_RESET]: 'Odeslat email pro změnu hesla',
      [MESSAGES.CONTRIBUTORS]: 'Kontributoři',
      [MESSAGES.ADD_CONTRIBUTOR]: 'Přidat kontributora',
      [MESSAGES.USER]: 'Uživatel',
      [MESSAGES.USER_ROLES]: 'Uživatelské role',
      [MESSAGES.SYSTEM_SETTINGS]: 'Systémové nastavení',
      [MESSAGES.GENERAL_TRANSLATIONS]: 'Obecné překlady',
      [MESSAGES.CREATE_TRANSLATION_KEY]: 'Vytvořit překladový klíč',
      [MESSAGES.FOR_LANGUAGE]: 'Pro jazyk',
      [MESSAGES.PAGINATION_CONTENT]:
        'Zobrazeno položek od {{from}} do {{to}}. Celkem je položek {{total}}.',
      [MESSAGES.CREATE_TRANSLATION_KEY_VALUE_DESC]:
        'Toto je překlad pro vybraný jazyk',
      [MESSAGES.ADD_CONTRIBUTOR_TEXT]:
        'Přidejte kontributory společně s jejich povoleními',
    },
  },
  en: {
    translation: defaultKeys,
  },
};
