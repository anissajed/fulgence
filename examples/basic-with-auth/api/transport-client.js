import {client_auth_plugin} from "./auth-plugins.js";
import client, {withPlugin} from "fulgence/transport/client/default";

const newClient = withPlugin(client_auth_plugin, client);
export default newClient;
