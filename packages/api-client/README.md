# PromCMS JS API Client

This is a javascript api client for your apps that use PROM CMS.

## Installation

```bash
yarn install @prom-cms/api-client
```

## How to use

```ts
import { ApiClient } from "@prom-cms/api-client"

// Initialize 
const client = new ApiClient({
  // you can use custom axios config here
  ...
});

// You can now send requests
await client.auth.login({
  email: "email@example.com",
  password: "some_strong_password"
});

```