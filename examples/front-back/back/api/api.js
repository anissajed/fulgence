import {entrypoint} from "fulgence";

const {CHUNK_NAME: name, PORT: port = 3101} = process.env;
const config_path = new URL("./api-config.json", import.meta.url).pathname;

const runServer = () => entrypoint({
  name,
  config_path,
  port,
});
export default runServer;
