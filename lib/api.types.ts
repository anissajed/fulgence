import {GetRawConfigOpts} from "./config/load-config.types.js";

export type Requester = (request_args: unknown, ...rest: unknown[]) => Promise<unknown>;
export type Api = Record<string, Requester>;

type BuildApiOpts = {local_module_name?: string} & GetRawConfigOpts;
export type BuildApi = (opts: BuildApiOpts) => Promise<Api>;
