import {Server, IncomingMessage} from "http";
import {ServerOpts} from "../types";

type OnRequest = (data: unknown, req: IncomingMessage) => unknown;
type BeforeResponseSent = (unknown) => unknown;
export interface ServerPlugin {
  onRequest?: OnRequest;
  beforeResponseSent?: BeforeResponseSent;
}

interface DefaultServerSpecificOpts {
  port?: number | string;
  req_max_size_bytes?: number;
  onReady?: (port: any) => void;
  onRequest?: OnRequest;
  beforeResponseSent?: BeforeResponseSent;
}
type DefaultServerOpts = ServerOpts & {
  opts: DefaultServerSpecificOpts;
}
export type DefaultServer = (opts: DefaultServerOpts) => Promise<Server>;

export type ServerWithPlugin = (plugin: ServerPlugin, server: DefaultServer) => DefaultServer;
