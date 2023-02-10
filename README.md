> ⚠️ Please be aware that this tool is under active development and is still not suitable for normal use. All help or interest is welcome! 🚀

# PromCMS

Welcome to PromCMS project. This project focuses on making smaller PHP projects simpler and faster to build.

## How it works 🤔

The general idea is that you provide config file with definitions on how should your PHP app should look like (defining models, app name, etc...) and just create a whole project from that with predefined workflow (webpack/vite, twig, slim php...)

This will boost your performance a lot and you can focus on what really matters - producing actual visible stuff 😉

## How to use

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
5. Generate CMS (still in the same folder as your config)
    ```bash
    npx @prom-cms/cli generate:cms
    ```
6. Now your project is prepared, ready to go and you can start your dev server 🎉
    ```bash
    npm run dev
    ```
7. You can now go to [http://localhost:3001](http://localhost:3000) 🤯
 
> You may also find useful to seed your database with random data with `npx @prom-cms/cli seed-database` 😳

## More 😲

* [Examples](./docs/examples/)