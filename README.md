> ⚠️ Please be aware that this tool is under active development and is still not suitable for normal use. All help or interest is welcome! 🚀

# PromCMS

Welcome to PromCMS project. This project focuses on making smaller PHP projects simpler and faster to build.

## How it works 🤔

The general idea is that you provide config file with definitions on how should your PHP app should look like (defining models, app name, etc...) and just create a whole project from that with predefined workflow (webpack/vite, twig, slim php...)

This will boost your performance a lot and you can focus on what really matters - producing actual visible stuff 😉

## Quick Start

1. Create a root of your desired project 
    ```bash
    mkdir test-project && cd ./test-project
    ```
2. **Optional:** Initialize your npm project to create package.json
    ```base
    npm init
    ```
3. **Optional:** Initialize git with 
    ```
    git init
    ```
4. Create a config file `prom.generate-config.(cjs|mjs|js|ts|json)` with you definitions (in the same folder as your config)
    - Config examples in [here](./docs/examples/) to get you started 🎉
5. Generate CMS (still in the same folder as your config)
    ```bash
    npx @prom-cms/cli generate-cms
    ```
6. Now your project is prepared, ready to go and you can start your dev server 🎉
    ```bash
    npm run dev
    ```
7. You can now go to [http://localhost:3000](http://localhost:3000) 🤯
 
> You may also find useful to seed your database with random data with `npx @prom-cms/cli seed-database` 😳

## More in Depth 😲

-   [Admin Package](./packages/admin/README.md) - All source files of admin portal
-   [Api Client Package](./packages/api-client/README.md)
-   [CLI Package](./packages/cli/README.md) - Know your CLI for easier management of PromCMS projects
-   [Config Package](./packages/config/README.md) - All internal configuration for typescript, prettier, tsup, etc...
-   [In Page Editor Package](./packages/in-page-editor/README.md)
-   [Schema Package](./packages/schema/README.md) - Know your powerful schema and use it to the fullest!
-   [Shared Package](./packages/shared/README.md) - Internal helpers
-   [Vite Plugin Package](./packages/vite-plugin/README.md) - Source files for vite plugin that manages development of PromCMS projects