import path from "path";
import {initServer} from "fulgence";
import {config} from "./config";

const {CHUNK_NAME: name = "", PORT: port = 3010} = process.env;

const onReady = ({api}) => {
  if ([undefined, "", "BaseService"].includes(process.env.CHUNK_NAME)) {
    setTimeout(async () => {
      const payload = {
        example: true,
      };

      const res = await api.BaseService.addCRMEntry(payload);
      console.log("Final result:", res);
    }, 1000);
  }
};

export const bootstrap = async () => {
  await initServer({
    name,
    server_opts: {port, onReady},
    raw_config: config,
    config_path: path.join(__dirname, "./api-config.virtual.json"),
  });
};
