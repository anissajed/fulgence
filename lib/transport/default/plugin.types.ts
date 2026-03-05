import {Server, IncomingMessage} from "http";
import {ClientFactory, ShellOpts, DestOpts} from "../types";

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
type OnRequest = (data: unknown, req: IncomingMessage) => unknown;
type BeforeResponseSent = (unknown) => unknown;
type OnResponse = (unknown) => unknown;
export interface Plugin {
  beforeRequest?: BeforeRequest;
  onRequest?: OnRequest;
  beforeResponseSent?: BeforeResponseSent;
  onResponse?: OnResponse;
}

type DefaultShellOpts = ShellOpts & {
  req_max_size_bytes?: number;
  onReady?: (port: any) => void;
  onRequest?: OnRequest;
  beforeResponseSent?: BeforeResponseSent;
}
export type DefaultShell = (opts: DefaultShellOpts) => Promise<Server>;
type DefaultClientFactory = ClientFactory;
export type DefaultTransport = {
  shell: DefaultShell;
  clientFactory: DefaultClientFactory;
  withPlugin: WithPlugin;
}

export type ExtendedShell = ({plugin, transport}: {plugin: Plugin, transport: DefaultTransport}) => DefaultShell;
export type ExtendedClientFactory = ({plugin, transport}: {plugin: Plugin, transport: DefaultTransport}) => DefaultClientFactory;

export type WithPlugin = (plugin: Plugin, transport: DefaultTransport) => DefaultTransport;
