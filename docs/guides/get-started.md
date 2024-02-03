# Get Started

1. Create a root of your desired project 
    ```bash
    mkdir test-project && cd ./test-project
    ```
2. **Optional:** Initialize your pnpm project to create package.json
    ```base
    pnpm init
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
    pnpm run dev
    ```
7. You can now go to [http://localhost:3000](http://localhost:3000)