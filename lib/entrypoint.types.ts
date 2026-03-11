import {Api} from "./api.types";
import {
  ServerInstance,
  ServerSpecificOpts,
} from "./transport/server/types";

type EntrypointOpts = {
  name: string;
  config_path: string;
  server_opts?: ServerSpecificOpts;
};
interface EntrypointRes {
  server: ServerInstance;
  api: Api;
};
export type Entrypoint = (opts: EntrypointOpts) => Promise<EntrypointRes>;
