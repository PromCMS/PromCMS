# PromCMS

Welcome to PromCMS project. This project focuses on making smaller PHP projects simpler and faster to build.

## How it works 🤔

The general idea is that you provide JSON with definitions on how should your PHP app should look like (defining models, app name, etc...) and just create a whole project from that with predefined workflow (webpack/vite, twig, slim php...)

This will boost your performance a lot and you can focus on what really matters - producing actual visible stuff for your clients 😉

## How to use

1. Create a json file with you definitions
2. Run `npx @prom-cms/cli generate:develop -c prom.gen-config.js ./some-project-root` to generate 
3. Now your project is prepared and ready to go and you can start your dev server with `docker-compose up -d && yarn dev` 🎉 
4. You can now go to [http://localhost:3001/] 🤯