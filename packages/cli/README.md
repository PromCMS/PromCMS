<center>
<h1><code>@prom-cms/cli</code></h1>

This is a cli package of PromCMS that makes things happen.
</center>

## 🍻 Commands

### `db`

TBD

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

- `--ensure-json-schema`
    - **Boolean** (default: true), optional
    - If .json PromCMS config is defined it updates the config and ensures correct schema definition with correct version is used

#### 😎 Examples

- Update admin and models in default module: `npx @prom-cms/cli project update`

- Update only models in default module: `npx @prom-cms/cli project update --admin false`
