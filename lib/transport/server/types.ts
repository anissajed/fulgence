import {Api as GenericApi} from "../../api.types.js";

export type ServerInstance = unknown;
export type ServerOpts<SpecificOpts = unknown, Api = GenericApi> = {
  api: Api;
  name: string;
  opts?: SpecificOpts;
};
export type Server<SpecificOpts = unknown, Api = GenericApi> = (opts: ServerOpts<SpecificOpts, Api>) => Promise<ServerInstance>;
