import entrypoint, {loadConfigJSON} from "../../../index.js";

const {CHUNK_NAME: name, PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.json", import.meta.url).pathname;
const config = await loadConfigJSON(config_path);

const runServer = async () => {
  const {server, api} = await entrypoint({
    name,
    config_path,
    config,
    port,
  });

  return {server, api};
};
export default runServer;
