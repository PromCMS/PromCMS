<center>
<h1><code>@prom-cms/cli</code></h1>

This is a cli package of PromCMS that makes things happen.
</center>

## 🍻 Commands

### `db`

TBD

### `users`

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

### `project`

Main command for managing your project

#### `project create`

Subcommand to create project

##### 🔯 Parameters

- `--cwd`/`-c`
    - **String** (default: current cwd), optional
    - Path to PromCMS project

#### 😎 Examples

- Generate normally in current directory: `npx @prom-cms/cli project create`

- Create in custom directory: `npx @prom-cms/cli generate-cms --cwd ../../directory`

#### `admin:update`

Subcommand to update your admin. It removes old version and generates the admin files anew.

##### 🔯 Parameters

- `--cwd`/`-c`
    - **String** (default: current cwd), optional
    - Path to PromCMS project

#### `database:migration:create`

Validates PromCMS config, applies configuration to Models

##### 🔯 Parameters

- `--cwd`/`-c`
    - **String** (default: current cwd), optional
    - Path to PromCMS project

#### `database:migration:apply`

Connects to database and applies

##### 🔯 Parameters

- `--cwd`/`-c`
    - **String** (default: current cwd), optional
    - Path to PromCMS project
