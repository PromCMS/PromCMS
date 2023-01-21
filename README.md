> ⚠️ Please be aware that this tool is under active development and is still not suitable for normal use. All help on interest would be awesome! 🚀

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
1. Create a config file `prom.generate-config.(cjs|mjs|js|ts|json)` with you definitions
2. Generate CMS (in the same folder as your config)
    ```bash
    npx @prom-cms/cli generate:cms
    ```
3. Now your project is prepared, ready to go and you can start your dev server 🎉
    ```bash
    npm run dev
    ```
5. You can now go to [http://localhost:3001](http://localhost:3001) 🤯
 
> You may also find useful to seed your database with random data with `npx @prom-cms/cli seed-database` 😳