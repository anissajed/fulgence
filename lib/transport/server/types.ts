import {Api} from "../../api.types.js";

export type ServerInstance = unknown;
export type ServerOpts<T = unknown> = {
  api: Api;
  name: string;
  opts?: T;
};
export type Server<T = unknown> = (opts: ServerOpts<T>) => Promise<ServerInstance>;
