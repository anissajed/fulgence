import {server_auth_plugin} from "./auth-plugins.js";
import {server as baseServer, withPlugin} from "fulgence/transport/server/default";

export const server = withPlugin(server_auth_plugin, baseServer);
