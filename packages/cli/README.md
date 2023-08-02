<center>
# `@prom-cms/cli`

This is a cli package of PromCMS that makes things happen.
</center>

## 🍻 Commands 

### `db-tools`

Move quick in your database layer with the help of CLI

#### `db-tools:migrate`

Let's you migrate from MySQL (or MariaDB) export file (**.json**) and converts your data into prom-cms own database. 

##### 🏴‍☠️ Flags

- `--empty`/`-e` 
    - **Boolean** (default: "true"), optional
    - If old prom-cms data should be deleted first

##### 🔯 Parameters

1. Path to a json file that contains all of your exported data
    - String

##### 😎 Examples

`npx @prom-cms/cli db-tools:migrate export.json`

> ⛔️ This does not handle creating models for you. You have to define models first in "`prom-cms.config.(json|js|ts|mjs|cjs)`" and then run this tool.

### `users`

Manage users with the help of a CLI

#### `users:change-password`

Let's you change password for selected user (by email)

##### 😎 Examples

`npx @prom-cms/cli user:change-password`

#### `users:create`

Let's you create new user with provided email, password and full name

##### 😎 Examples

`npx @prom-cms/cli user:create`

#### `users:delete`

Let's you delete user by email

##### 😎 Examples

`npx @prom-cms/cli user:delete`

### `generate-cms`

Main command

#### 🏴‍☠️ Flags

- `--regenerate`/`-r` 
    - **Boolean** (default: "false"), optional
    - ⛔️ It removes all previously created files (except .env and config) and creates entire project again.

- `--packageManager`/`-p`
    - **String**, Enum ('yarn', 'npm', 'pnpm'), required
    - To specify which package manager use

- `--skip`/`-s`
    - **String**
        - Steps: *cleanup, package-json, admin, resources, module, models, composer-json*
    - To specify which steps to skip

#### 😎 Examples

- Generate normally: `npx @prom-cms/cli generate-cms`

- Regenerate only models: `npx @prom-cms/cli generate-cms --skip=*,!models`

- Regenerate admin and models (useful after dependency update): `npx @prom-cms/cli generate-cms --skip=*,!models,!admin`

### `seed-database`

Let's you seed database with random data based on column types and settings

#### 🔯 Parameters

1. Root of your final project. With this you can seed even projects from remote folders.
    - String

#### 😎 Examples

- Seed project on cwd: `npx @prom-cms/cli seed-database .`

- Seed project on custom folder relative to cwd: `npx @prom-cms/cli seed-database ../../test-folder/here`


