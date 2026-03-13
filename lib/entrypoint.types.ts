import {Api} from "./api.types";
import {Config} from "./config/load-config.types";
import {DefaultServerSpecificOpts} from "./transport/server/default/server.types";
import {
  ServerInstance,
} from "./transport/server/types";

type EntrypointOptsBase<T = unknown> = {
  name: string;
  server_opts?: T;
};
type EntrypointOptsConfigPath<T = unknown> = EntrypointOptsBase<T> & {
  config_path: string;
};
type EntrypointOptsConfig<T = unknown> = EntrypointOptsBase<T> & {
  config: Config;
};
type EntrypointOpts<T = unknown> = EntrypointOptsConfigPath<T> | EntrypointOptsConfig<T>;
interface EntrypointRes {
  server: ServerInstance;
  api: Api;
};
export type Entrypoint<T = DefaultServerSpecificOpts> = (opts: EntrypointOpts<T>) => Promise<EntrypointRes>;
