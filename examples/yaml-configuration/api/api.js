import fs from "fs";
import {entrypoint, loadConfig} from "fulgence";
import {parse as parseYaml} from "yaml";
const {readFile} = fs.promises;

const {CHUNK_NAME: name, PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.yaml", import.meta.url).pathname;

/** @type import("fulgence").RawConfigLoader */
const loader = async (config_path) => {
  const yaml_content = await readFile(config_path, 'utf8');
  const parsed = parseYaml(yaml_content);
  console.log("Loaded YAML config file");
  return parsed;
};
const config = await loadConfig({path: config_path, loader});

const runServer = async () => {
  const {server, api} = await entrypoint({
    name,
    config,
    server_opts: {port},
  });

  return {server, api};
};
export default runServer;
