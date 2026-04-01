import {Server as GenericServer} from "fulgence";
import {bootstrap} from "#src/nest-main";
import {FulgenceModule} from "./fulgence-module/fulgence.module.js";
import {api_handler} from "./api.js";

interface CustomTransportServerOpts {
  port: string | number;
  onReady: Function;
};
type Server = GenericServer<CustomTransportServerOpts>;
export const server: Server = async ({opts: {port, onReady = () => {}} = {}}) => {
  const extra_modules = [FulgenceModule];
  const app = await bootstrap({port, extra_modules});

  await api_handler.prom;
  const api = api_handler.get();
  onReady({api});

  return app;
};

