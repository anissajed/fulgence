import {Api} from "./api.types.js";
import {GetRawConfigOpts, RawConfig} from "./config/load-config.types.js";
import {DefaultServerSpecificOpts} from "./transport/server/default/server.types.js";
import {
  ServerInstance,
} from "./transport/server/types.js";

type EntrypointOptsBase<T = unknown> = {
  name: string;
  server_opts?: T;
  api?: Api,
};
type EntrypointOpts<T = unknown> = EntrypointOptsBase<T> & GetRawConfigOpts;
interface EntrypointRes {
  server: ServerInstance;
  api: Api;
};
export type Entrypoint<T = DefaultServerSpecificOpts> = (opts: EntrypointOpts<T>) => Promise<EntrypointRes>;

type InitServerOpts<T = unknown> = {
  name: string;
  server_opts?: T;
  api?: Api,
  raw_config: RawConfig;
  config_path: string;
};
export type InitServer<T = DefaultServerSpecificOpts> = (opts: InitServerOpts<T>) => Promise<ServerInstance>;
