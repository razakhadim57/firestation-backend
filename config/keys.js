import dotenv from "dotenv";
const { NODE_ENV } = process.env;

let dotenvFilePath = ".env";

if (NODE_ENV && NODE_ENV.toLowerCase() !== "production") {
  dotenvFilePath += "." + NODE_ENV.toLowerCase();
}

dotenv.config({
  path: dotenvFilePath,
});

export const keys = {
  aws: {
    bucket: process.env.AWS_BUCKET || "cheggl-dev",
    endpoint: process.env.AWS_ENDPOINT || "fra1.digitaloceanspaces.com",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "DO00MMV9WXJ74RDA2BLX",
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY ||
      "dKCDqRMtq7rwbUoXqX8AG1zlR1fnGjxPLhErpuG4FQo",
  },

};