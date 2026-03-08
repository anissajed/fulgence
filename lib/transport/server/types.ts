import {Api} from "../../api.types";

export type ServerInstance = unknown;
export type PortServerOpt = number | string;
export type ArbitraryArgsServerOpts = Record<string, unknown>;
export type ServerOpts = {
  api: Api;
  port: PortServerOpt;
} & ArbitraryArgsServerOpts;
export type Server = (opts: ServerOpts) => Promise<ServerInstance>;
