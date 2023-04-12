# CLI user management

Our cli provides simple user management so you can move even quicker. Each step might ask you for additional info.

## User creation

`npx @prom-cms/cli users:create`

### Will ask for:

- Email
- Password
- Full name

### Has optional cli arguments

- `--cwd` or `-c` - For specifying prom-cms project root 

## User password change

`npx @prom-cms/cli users:change-password`

### Will ask for:

- Email
- Password

### Has optional cli arguments

- `--cwd` or `-c` - For specifying prom-cms project root 

## User delete

`npx @prom-cms/cli users:delete`

### Will ask for:

- Email

### Has optional cli arguments

- `--cwd` or `-c` - For specifying prom-cms project root 