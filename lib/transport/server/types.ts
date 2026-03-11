import {Api} from "../../api.types";

export type ServerInstance = unknown;
export type ServerSpecificOpts = unknown;
export type ServerOpts = {
  api: Api;
  name: string;
  opts?: ServerSpecificOpts;
};
export type Server = (opts: ServerOpts) => Promise<ServerInstance>;
