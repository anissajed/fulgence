import {createServer} from "./express.js";
import {baseJaysonMethods, jsonRpcMiddlewareFactory} from "./jayson.js";

/** @type import("../../types").Server */
export const server = async ({opts: {port, onReady}, name, api}) => {
  const methods = baseJaysonMethods({api});
  const router = jsonRpcMiddlewareFactory({methods, endpoint: "/"});
  const server = createServer({
    router,
    port,
    name,
    onReady: () => onReady({api}),
  });

  return server;
};
