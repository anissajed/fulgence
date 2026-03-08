import {client_auth_plugin} from "./auth-plugins.js";
import {client as baseClient, withPlugin} from "fulgence/transport/client/default";

export const client = withPlugin(client_auth_plugin, baseClient);
