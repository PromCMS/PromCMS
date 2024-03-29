import { FieldPlacements } from './columnType/columnTypeBaseAdminConfigSchema.js';
import { GeneratorConfigInput } from './generatorConfigSchema.js';
import { SecurityOptionOptions } from './projectSecurityRoleModelPermissionSchema.js';

export const mockedGeneratorConfig: GeneratorConfigInput = {
  project: {
    name: 'Mocked project',
    url: 'http://localhost',
    security: {
      roles: [
        {
          name: 'Editor',
          slug: 'editor',
          modelPermissions: {
            posts: {
              u: SecurityOptionOptions.ALLOW_ALL,
            },
          },
        },
      ],
    },
  },
  database: {
    connections: [
      {
        name: 'base-connection',
        uri: 'pdo-sqlite:///.database/database.sqlite',
      },
    ],
    models: [
      {
        title: 'Články',
        tableName: 'posts',
        timestamp: true,
        sorting: true,
        draftable: true,
        preset: 'post',
        admin: {
          icon: 'Archive',
        },
        columns: [
          // Content and title is added as a default
          {
            name: 'description',
            type: 'longText',
            title: 'Popisek',
            admin: {
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
        ],
      },
      {
        title: 'Stránky',
        tableName: 'pages',
        timestamp: true,
        sorting: true,
        draftable: true,
        admin: { icon: 'Notebook' },
        preset: 'post',
        columns: [
          // Content and title is added as a default
          {
            name: 'showInMenu',
            type: 'boolean',
            title: 'Zobrazit v menu',
            defaultValue: false,
            admin: {
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
          {
            name: 'hero_image',
            type: 'file',
            title: 'Úvodní obrázek',
            typeFilter: 'image',
            admin: {
              isHidden: true,
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
          {
            name: 'anotherFile',
            type: 'file',
            title: 'Další soubor',
            admin: {
              isHidden: true,
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
          {
            name: 'someFile',
            type: 'file',
            title: 'Další soubory',
            admin: {
              isHidden: true,
            },
          },
          {
            name: 'excerpt',
            type: 'longText',
            title: 'Krátký popisek',
            localized: true,
            admin: {
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
          {
            name: 'description',
            type: 'longText',
            title: 'Popisek',
            localized: true,
            admin: {
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
        ],
      },
    ],
    singletons: [
      {
        tableName: 'frontpage',
        title: 'Hlavní stránka',
        admin: { icon: 'Archive' },
        preset: 'post',
        columns: [
          {
            name: 'heroImage',
            type: 'file',
            title: 'Úvodní obrázek',
            typeFilter: 'image',
            multiple: true,
            admin: {
              isHidden: true,
              fieldType: 'big-image',
            },
          },
          {
            name: 'image',
            type: 'file',
            title: 'Next image',
            typeFilter: 'image',
            admin: {
              isHidden: true,
              editor: {
                placement: FieldPlacements.ASIDE,
              },
            },
          },
          {
            name: 'openingHours',
            type: 'json',
            title: 'Opening hours test',
            admin: {
              fieldType: 'openingHours',
            },
          },
          {
            name: 'rip',
            type: 'json',
            title: 'Repeater test',
            admin: {
              fieldType: 'repeater',
              editor: {
                placement: FieldPlacements.ASIDE,
              },
              columns: [
                {
                  name: 'name',
                  type: 'string',
                },
                {
                  name: 'value',
                  title: 'value',
                  type: 'string',
                },
                {
                  name: 'unmb',
                  type: 'number',
                },
              ],
            },
          },
          {
            name: 'ripTwo',
            type: 'json',
            title: 'Repeater test',
            admin: {
              fieldType: 'repeater',
              columns: [
                {
                  name: 'name',
                  type: 'string',
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
