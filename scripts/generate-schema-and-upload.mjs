// @ts-check

/**
 * @typedef {{major: number, minor: number, patch: number}} Version
 */

import FtpClient from "ftp";
import fs from "fs-extra";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema";

const { PROM_FTP_CONNECTION_STRING } = process.env;

if (!PROM_FTP_CONNECTION_STRING) {
  throw new Error("Missing PROM_FTP_CONNECTION_STRING");
}

const ftpConnectionURL = new URL(PROM_FTP_CONNECTION_STRING);

/**
 *
 * @param {Version} version
 * @param {string} fileContent
 * @returns
 */
const uploadFile = (version, fileContent) =>
  new Promise((resolve, reject) => {
    const client = new FtpClient();
    const tempFilepath = path.join(process.cwd(), "scripts/.temp/schema.json");
    fs.ensureFileSync(tempFilepath);
    fs.writeFileSync(tempFilepath, fileContent);
    const file = fs.readFileSync(tempFilepath);
    const versionAsArray = Object.values(version);

    client.on("ready", async () => {
      await Promise.all(
        versionAsArray.flatMap((_version, index) => {
          const part = versionAsArray.slice(0, index + 1).join("/");
          const pathname = `/subdoms/schema/versions/${part}`;

          // Ensure directory first and then upload file
          return [
            new Promise((resolveOne, rejectOne) =>
              client.mkdir(pathname, true, (err) => {
                if (err) rejectOne(err);
                resolveOne(undefined);
              })
            ),
            new Promise((resolveOne, rejectOne) => {
              client.put(file, `${pathname}/schema.json`, (err) => {
                if (err) rejectOne(err);
                resolveOne(undefined);
              });
            }),
          ];
        })
      ).catch(reject);

      client.end();
    });

    client.on("error", (error) => {
      reject(error);
      client.end();
    });

    client.on("end", () => {
      fs.removeSync(tempFilepath);
      resolve(undefined);
    });

    console.log({
      connection: {
        host: ftpConnectionURL.host,
        port: Number(ftpConnectionURL.port || 21),
        user: ftpConnectionURL.username,
      },
    });

    client.connect({
      host: ftpConnectionURL.host,
      port: Number(ftpConnectionURL.port || 21),
      password: ftpConnectionURL.password,
      user: ftpConnectionURL.username,
    });
  });

/**
 *
 * @returns {Promise<Version>}
 */
const getVersion = async () => {
  const { version } = await fs.readJson(
    path.join(process.cwd(), "packages/schema/package.json")
  );
  /**
   * @type {[number, number, number]}
   */
  const [major, minor, patch] = version.split(".").map(Number);

  return {
    major,
    minor,
    patch,
  };
};

console.log("-- Begin schema generate");
const { generatorConfigSchema } = await import("@prom-cms/schema");
console.log("Schema has been found!");
const jsonSchema = JSON.stringify(
  zodToJsonSchema(generatorConfigSchema, "prom-cms-generate-schema")
);
console.log("Schema has been generated");
console.log(jsonSchema);

console.log("-- Begin schema upload");
const version = await getVersion();
console.log(`Will upload for version "${Object.values(version).join(".")}"`);

await uploadFile(version, jsonSchema);
console.log("FTP upload complete!");
