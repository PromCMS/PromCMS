# PromCMS

Welcome to PromCMS project. This project focuses on making smaller PHP projects simpler and faster to build.

## How it works 🤔

The general idea is that you provide config file with definitions on how should your PHP app should look like (defining models, app name, etc...) and just create a whole project from that with predefined workflow (webpack/vite, twig, slim php...)

This will boost your performance a lot and you can focus on what really matters - producing actual visible stuff 😉

## How to use

1. Create a config file `prom.generate-config.(cjs|mjs|js|ts|json)` with you definitions somewhere where your apps should be 
2. Run from where you created that config file `npx @prom-cms/cli generate:cms -c <your-config-filename>` to generate 
3. Now your project is prepared, ready to go and you can start your dev server with `yarn dev` 🎉
5. You can now go to [http://localhost:3001](http://localhost:3001) 🤯
 
> You may also find useful to seed your database with random data with `npx @prom-cms/cli seed-database` 😳