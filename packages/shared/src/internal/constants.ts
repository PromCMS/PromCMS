import {
  FieldPlacements,
  GeneratorConfigInput,
  SecurityOptionOptions,
} from '@prom-cms/schema';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = 3000;

export const monorepoRoot = path.join(__dirname, '..', '..', '..', '..');
export const developmentPHPAppPath = path.join(
  monorepoRoot,
  'node_modules',
  '.prom-cms',
  'php-app'
);

export const mockedGeneratorConfig: GeneratorConfigInput = {
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
        preset: 'post',
        title: 'Články',
        columns: {
          // Content and title is added as a default
          description: {
            type: 'longText',
            title: 'Popisek',
            admin: {
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
        },
      },
      pages: {
        timestamp: true,
        sorting: true,
        draftable: true,
        icon: 'Notebook',
        preset: 'post',
        columns: {
          // Content and title is added as a default
          showInMenu: {
            type: 'boolean',
            title: 'Zobrazit v menu',
            default: false,
            translations: false,
            admin: {
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
          hero_image: {
            type: 'file',
            title: 'Úvodní obrázek',
            typeFilter: 'image',
            translations: false,
            admin: {
              isHidden: true,
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
          anotherFile: {
            type: 'file',
            title: 'Další soubor',
            translations: false,
            admin: {
              isHidden: true,
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },

          someFile: {
            type: 'file',
            title: 'Další soubory',
            translations: false,
            admin: {
              isHidden: true,
            },
          },
          excerpt: {
            type: 'longText',
            title: 'Krátký popisek',
            admin: {
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
          description: {
            type: 'longText',
            title: 'Popisek',
            admin: {
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
        },
      },
      positions: {
        icon: 'BuildingFactory',
        sharable: false,
        columns: {
          description: {
            type: 'longText',
            title: 'Popisek',
          },
        },
      },
      contacts: {
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
        preset: 'post',
        icon: 'Speakerphone',
        sorting: true,
        draftable: false,
        columns: {
          name: {
            type: 'string',
            title: 'Název',
            unique: true,
            required: true,
            admin: {
              fieldType: 'heading',
            },
          },
          slug: {
            type: 'slug',
            of: 'name',
            title: 'Slug',
            editable: false,
            admin: {
              isHidden: true,
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
        },
      },
    },
    singletons: {
      frontPage: {
        icon: 'Archive',
        preset: 'post',
        columns: {
          heroImage: {
            type: 'file',
            title: 'Úvodní obrázek',
            typeFilter: 'image',
            translations: false,
            multiple: true,
            admin: {
              isHidden: true,
              fieldType: 'big-image',
            },
          },
          image: {
            type: 'file',
            title: 'Next image',
            typeFilter: 'image',
            translations: false,
            admin: {
              isHidden: true,
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
          openingHours: {
            type: 'json',
            title: 'Opening hours test',
            admin: {
              fieldType: 'openingHours',
            },
          },
          rip: {
            type: 'json',
            title: 'Repeater test',
            admin: {
              fieldType: 'repeater',
              editor: {
                placement: FieldPlacements.ASIDE,
              },
              columns: {
                name: {
                  type: 'string',
                },
                value: {
                  title: 'value',
                  type: 'string',
                },
                unmb: {
                  type: 'number',
                },
              },
            },
          },
          ripTwo: {
            type: 'json',
            title: 'Repeater test',
            admin: {
              fieldType: 'repeater',
              columns: {
                name: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};
