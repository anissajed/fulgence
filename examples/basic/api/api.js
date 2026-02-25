import entrypoint, {buildApi, loadConfigJSON} from "../../../index.js";

const {CHUNK_NAME: name, PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.json", import.meta.url).pathname;
const config = await loadConfigJSON(config_path);

export const getApi = () => buildApi({
  local_module_name: name,
  config_path,
  config,
});

const runServer = async () => {
  const webserver = await entrypoint({
    name,
    config_path,
    config,
    port,
  });

  return webserver;
};
export default runServer;
