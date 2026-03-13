import {Api} from "./api.types";
import {GetRawConfigOpts} from "./config/load-config.types";
import {DefaultServerSpecificOpts} from "./transport/server/default/server.types";
import {
  ServerInstance,
} from "./transport/server/types";

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
