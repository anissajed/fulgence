import {createExpressServer} from "./express.js";
import {baseJaysonMethods, jsonRpcMiddlewareFactory} from "./jayson.js";

/** @type import("../../types").Server */
export const server = async ({opts: {port}, name, api}) => {
  const methods = baseJaysonMethods({api});
  const router = jsonRpcMiddlewareFactory({methods, endpoint: "/"});
  const server = createExpressServer({router, port, name});

  return server;
};
