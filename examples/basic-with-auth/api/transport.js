import {auth_plugin} from "./auth-plugin.js";
import transport from "fulgence/default-transport";

const {shell, clientFactory} = transport.withPlugin(auth_plugin, transport);
/* We re-export withPlugin here to allow extend this custom transport
 * the same way the default transport is extended in this file.
 * This logic is not mandatory in the current situation.
 */
export default {shell, clientFactory, withPlugin: transport.withPlugin};
