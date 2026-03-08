import {Api} from "./api.types";
import {
  ServerInstance,
  ArbitraryArgsServerOpts,
  PortServerOpt,
} from "./transport/server/types";

type EntrypointOpts = {
  name: string;
  config_path: string;
  port: PortServerOpt;
} & ArbitraryArgsServerOpts;
interface EntrypointRes {
  server: ServerInstance;
  api: Api;
};
export type Entrypoint = (opts: EntrypointOpts) => Promise<EntrypointRes>;
