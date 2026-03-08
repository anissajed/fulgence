import {Client, DestOpts} from "../types";

interface BeforeRequestOpts {
  body: unknown;
  fetch_opts: RequestInit;
  dest_opts: DestOpts;
}
interface BeforeRequestRes {
  body: unknown;
  fetch_opts: RequestInit;
}
type BeforeRequest = (opts: BeforeRequestOpts) => Promise<BeforeRequestRes>;
type OnResponse = (unknown) => unknown;
export interface ClientPlugin {
  beforeRequest?: BeforeRequest;
  onResponse?: OnResponse;
}

type DefaultClientRequester = (request_args: unknown, fetch_opts: RequestInit) => Promise<unknown>;
export type DefaultClient = Client & ((dest_opts: DestOpts) => DefaultClientRequester);

export type ClientWithPlugin = (plugin: ClientPlugin, client: DefaultClient) => DefaultClient;
