import {auth_plugin} from "./auth-plugin.js";
/* In a "real world" situation, you would rather use something like:
 * import transport from "fulgence/default-transport";
 */
import transport from "../../../lib/transport/default/index.js";
import {withPlugin} from "../../../lib/transport/default/plugin.js";

const {shell, clientFactory} = transport.withPlugin(auth_plugin, transport);
/* We re-export withPlugin here to allow extend this custom transport
 * the same way the default transport is extended in this file.
 * This line is not mandatory in the current situation.
 */
export default {shell, clientFactory, withPlugin};
