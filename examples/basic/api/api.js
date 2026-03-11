import {entrypoint} from "fulgence";

const {CHUNK_NAME: name, PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.json", import.meta.url).pathname;

const runServer = async () => {
  const {server, api} = await entrypoint({
    name,
    config_path,
    server_opts: {port},
  });

  return {server, api};
};
export default runServer;
