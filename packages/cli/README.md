<center>
<h1><code>@prom-cms/cli</code></h1>

This is a cli package of PromCMS that makes things happen.
</center>

## 🍻 Commands 

### `db`

Move quick in your database layer with the help of CLI

#### `db migrate`

Let's you migrate from MySQL (or MariaDB) export file (**.json**) and converts your data into PromCMS own database. 

##### 🔯 Parameters

- `--cwd`/`-c` 
    - **String** (default: current cwd), optional
    - Path to PromCMS project

- `--file`/`-f` 
    - **String**, required
    - Path to a json file that contains all of your exported data

##### 😎 Examples

`npx @prom-cms/cli db migrate --file export.json`

> ⛔️ This does not handle creating models for you. You have to define models first in "`.prom-cms/config.(json|js|ts|mjs|cjs)`" and then run this tool.

#### `db seed`

Let's you seed database with random data based on column types and settings

##### 🔯 Parameters

- `--cwd`/`-c` 
    - **String** (default: current cwd), optional
    - Path to PromCMS project

##### 😎 Examples

- Seed project on cwd: `npx @prom-cms/cli db seed`

- Seed project on custom folder relative to cwd: `npx @prom-cms/cli db seed --cwd ../../test-folder/here`

### `users`

Manage users with the help of a CLI

#### `users change-password`

Let's you change password for selected user (by email)

##### 😎 Examples

`npx @prom-cms/cli user change-password`

#### `users create`

Let's you create new user with provided email, password and full name

##### 😎 Examples

`npx @prom-cms/cli user create`

#### `users delete`

Let's you delete user by email

##### 😎 Examples

`npx @prom-cms/cli user delete`

### `project`

Main command for managing your project

#### `project create`

Subcommand to create project

##### 🔯 Parameters

- `--cwd`/`-c` 
    - **String** (default: current cwd), optional
    - Path to PromCMS project

#### 😎 Examples

- Generate normally in current directory: `npx @prom-cms/cli project create`

- Create in custom directory: `npx @prom-cms/cli generate-cms --cwd ../../directory`

#### `project update`

Subcommand to update your project. Useful for the time when you update @prom-cms/cli inside your project or update your PromCMS config

##### 🔯 Parameters

- `--cwd`/`-c` 
    - **String** (default: current cwd), optional
    - Path to PromCMS project

- `--admin`/`-a` 
    - **Boolean** (default: true), optional
    - If admin should be regenerated or not

#### 😎 Examples

- Update admin and models in default module: `npx @prom-cms/cli project update`

- Update only models in default module: `npx @prom-cms/cli project update --admin false`


