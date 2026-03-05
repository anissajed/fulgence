import {Api} from "./api.types";
import {
  AnyServer,
  ArbitraryArgsShellOpts,
  PortShellOpt,
} from "./transport/types";

type EntrypointOpts = {
  name: string;
  config_path: string;
  port: PortShellOpt;
} & ArbitraryArgsShellOpts;
interface EntrypointRes {
  server: AnyServer;
  api: Api;
};
export type Entrypoint = (opts: EntrypointOpts) => Promise<EntrypointRes>;
