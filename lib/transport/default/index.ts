import {clientFactory} from "./client.js";
import {shell} from "./server.js";
import {withPlugin} from "./plugin.js";
import {DefaultTransport} from "./plugin.types.js";

export type {
  Plugin,
  DefaultShell,
  DefaultTransport,
  ExtendedShell,
  ExtendedClientFactory,
  WithPlugin,
} from "./plugin.types.js";

const plugin: DefaultTransport = {clientFactory, shell, withPlugin};
export default plugin;
