import {Requester} from "../../api.types.js";

export interface DestOpts {
  name: string;
  url: RequestInfo | URL;
};

export type Client = (dest_opts: DestOpts) => Requester;
