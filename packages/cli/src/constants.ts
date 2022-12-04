import { GeneratorConfig, SecurityOptionOptions } from '@prom-cms/shared';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PACKAGE_ROOT = path.join(__dirname, '..');
export const SCRIPTS_ROOT = path.join(PACKAGE_ROOT, 'scripts');
export const PROJECT_ROOT = path.join(PACKAGE_ROOT, '..', '..');
export const TEMPLATES_ROOT = path.join(PACKAGE_ROOT, 'templates');

export const mockedGeneratorConfig: GeneratorConfig = {
  project: {
    name: 'Mocked project',
    url: 'http://localhost',
    security: {
      roles: [
        {
          name: 'Editor',
          modelPermissions: {
            posts: {
              u: SecurityOptionOptions.ALLOW_EVERYTHING,
            },
          },
        },
      ],
    },
  },
  database: {
    models: {
      posts: {
        timestamp: true,
        icon: 'Archive',
        sorting: true,
        draftable: true,
        columns: {
          // Content and title is added as a default
          description: {
            type: 'longText',
            title: 'Popisek',
          },
        },
      },
      pages: {
        timestamp: true,
        sorting: true,
        draftable: true,
        icon: 'Notebook',
        columns: {
          // Content and title is added as a default
          showInMenu: {
            type: 'boolean',
            title: 'Zobrazit v menu',
            default: false,
            translations: false,
          },
          hero_image: {
            type: 'file',
            title: 'Úvodní obrázek',
            adminHidden: true,
            typeFilter: 'image',
            translations: false,
          },
          excerpt: {
            type: 'longText',
            title: 'Krátký popisek',
          },
          description: {
            type: 'longText',
            title: 'Popisek',
          },
        },
      },
      positions: {
        icon: 'BuildingFactory',
        sharable: false,
        columns: {
          // Content and title is added as a default
          description: {
            type: 'longText',
            title: 'Popisek',
          },
        },
      },
      services: {
        icon: 'Briefcase',
        sorting: true,
        columns: {
          // Content and title is added as a default
          hero_image: {
            type: 'file',
            title: 'Úvodní obrázek',
            adminHidden: true,
            typeFilter: 'image',
            translations: false,
          },
          excerpt: {
            type: 'longText',
            title: 'Krátký popisek',
          },
          description: {
            type: 'longText',
            title: 'Popisek',
          },
        },
      },
      contacts: {
        admin: {
          layout: 'simple',
        },
        icon: 'Phone',
        sharable: false,

        columns: {
          position: {
            type: 'string',
            unique: false,
            title: 'Pozice',
            required: true,
          },
          category: {
            type: 'relationship',
            labelConstructor: 'name',
            targetModel: 'contactPositions',
            title: 'Kategorie',
            fill: false,
            required: true,
            translations: false,
          },
          name: {
            type: 'string',
            title: 'Jméno',
            required: true,
          },
          first_telephone: {
            type: 'string',
            title: 'Telefon',
            translations: false,
          },
          second_telephone: {
            type: 'string',
            title: 'Druhý telefon',
            translations: false,
          },
          email: {
            type: 'string',
            title: 'Email',
          },
        },
      },
      contactPositions: {
        tableName: 'contactPositions',
        admin: {
          layout: 'simple',
        },
        icon: 'Speakerphone',
        sorting: true,
        draftable: false,
        columns: {
          name: {
            type: 'string',
            title: 'Název',
            unique: true,
            required: true,
          },
          slug: {
            type: 'slug',
            of: 'name',
            title: 'Slug',
            editable: false,
            adminHidden: true,
          },
        },
      },
    },
  },
};
