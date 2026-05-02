import type {Server as GenericServer} from "fulgence";
import type {Api, CustomTransportServerOpts} from "../../api/api.types.js";
import {createHonoApp, createHonoServer} from "./hono.js";

const default_opts: CustomTransportServerOpts = {
  port: 3010,
  onReady: ({api}) => {},
};

type Server = GenericServer<CustomTransportServerOpts, Api>;
export const server: Server = async ({
  opts: {port, onReady} = default_opts,
  name,
  api,
}) => {
  const app = createHonoApp({api});
  createHonoServer({
    app,
    port,
    name,
    onReady: () => onReady({api}),
  });
};


