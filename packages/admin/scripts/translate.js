// @ts-check
import fs from 'fs-extra';
import translatte from 'translatte';
import * as tsImport from 'ts-import';

const { MESSAGES } = await tsImport.load('src/constants/texts.ts', {
  compileOptions: {
    compilerOptions: {
      rootDir: 'src',
      baseUrl: './src',
    },
  },
});

const { adminLanguages } = await tsImport.load(
  'src/constants/adminLanguages.ts',
  {
    compileOptions: {
      compilerOptions: {
        rootDir: 'src',
        baseUrl: './src',
      },
    },
  }
);

const messagesAsArray = Object.entries(MESSAGES);
const languages = Object.keys(adminLanguages).filter((item) => item !== 'en');
const result = Object.fromEntries(languages.map((lang) => [lang, {}]));

for (const [key, valueToTranslate] of messagesAsArray) {
  if (!valueToTranslate) {
    continue;
  }

  for (const lang of languages) {
    const { text } = await translatte(valueToTranslate, {
      from: 'en',
      to: lang,
    });

    result[lang][key] = text;

    console.log(`[${lang}] ${key} - ${text}`);
  }
}

let content = '';

for (const lang of languages) {
  content += `\n  ${lang}: {`;

  const translations = Object.entries(result[lang]);
  for (const [key, value] of translations) {
    content += `\n    [MESSAGES.${key}]: "${value}",`;
  }

  content += `\n  },`;
}

await fs.writeFile('./res.txt', `const c = {${content}\n}`);
