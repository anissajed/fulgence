import {entrypoint} from "fulgence";
import {objectOrientedApi} from "./oo-api.js";

const {CHUNK_NAME: name, PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.json", import.meta.url).pathname;

const runServer = async ({
  onReady = ({api}) => {}
} = {}) => {
  await entrypoint({
    name,
    config_path,
    server_opts: {
      port,
      onReady: ({api}) => {
        const oo_api = objectOrientedApi({api});
        onReady({api: oo_api});
      },
    },
  });
};
export default runServer;
