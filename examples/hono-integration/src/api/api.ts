import {entrypoint} from "fulgence";
import type {Api, Entrypoint} from "./api.types.js";

const typedEntrypoint: Entrypoint = entrypoint;

const {CHUNK_NAME: name = "", PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.json", import.meta.url).pathname;

export const runServer = async ({
  onReady = (opts: {api: Api}) => {},
} = {}) => {
  await typedEntrypoint({
    name,
    config_path,
    server_opts: {port, onReady},
  });
};
