import {Api} from "./api.types.js";
import {GetRawConfigOpts} from "./config/load-config.types.js";
import {DefaultServerSpecificOpts} from "./transport/server/default/server.types.js";
import {
  ServerInstance,
} from "./transport/server/types.js";

type EntrypointOptsBase<T = unknown> = {
  name: string;
  server_opts?: T;
};
type EntrypointOpts<T = unknown> = EntrypointOptsBase<T> & GetRawConfigOpts;
interface EntrypointRes {
  server: ServerInstance;
  api: Api;
};
export type Entrypoint<T = DefaultServerSpecificOpts> = (opts: EntrypointOpts<T>) => Promise<EntrypointRes>;
