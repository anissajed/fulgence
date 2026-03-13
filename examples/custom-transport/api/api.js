import {entrypoint} from "fulgence";
/** @type import("../types").Entrypoint */
const typedEntrypoint = entrypoint;

const {CHUNK_NAME: name, PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.json", import.meta.url).pathname;

const runServer = async () => {
  const {server, api} = await typedEntrypoint({
    name,
    config_path,
    server_opts: {port},
  });

  return {server, api};
};
export default runServer;
