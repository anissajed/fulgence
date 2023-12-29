import entrypoint, {callEntrypointFactory, loadConfigJSON} from "../../index.js";

const {CHUNK_NAME: name, PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.json", import.meta.url).pathname;
const config = await loadConfigJSON(config_path);

export const callEntrypoint = await callEntrypointFactory({config_path, config, name});

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
