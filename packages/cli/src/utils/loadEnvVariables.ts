export const getEnvFilepath = async () => {
  const { default: findConfig } = await import('find-config');

  return (await findConfig('.env')) || '.env';
};

export const loadEnvVariables = async () => {
  const dotenv = await import('dotenv');

  await dotenv.config({ path: await getEnvFilepath() });
};
