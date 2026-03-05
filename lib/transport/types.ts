import {Api, Client} from "../api.types";

export interface DestOpts {
  name: string;
  url: RequestInfo | URL;
};

export type ClientFactory = (dest_opts: DestOpts) => Client;

export type AnyServer = unknown;
export type PortShellOpt = number | string;
export type ArbitraryArgsShellOpts = Record<string, unknown>;
export type ShellOpts = {
  api: Api;
  port: PortShellOpt;
} & ArbitraryArgsShellOpts;
export type Shell = (opts: ShellOpts) => Promise<AnyServer>;

export interface Transport {
  clientFactory: ClientFactory;
  shell: Shell;
}
