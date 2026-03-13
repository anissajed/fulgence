import fs from "fs";
import {entrypoint} from "fulgence";
import {parse as parseYaml} from "yaml";

const {CHUNK_NAME: name, PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.yaml", import.meta.url).pathname;

const yaml_content = await fs.promises.readFile(config_path, 'utf8');
const config = parseYaml(yaml_content);

const runServer = async () => {
  const {server, api} = await entrypoint({
    name,
    config,
    config_path,
    server_opts: {port},
  });

  return {server, api};
};
export default runServer;
