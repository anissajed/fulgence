import {Server as GenericServer, Entrypoint as GenericEntrypoint} from "fulgence";
interface CustomTransportServerOpts {
  port: string | number;
};

export type Server = GenericServer<CustomTransportServerOpts>;

export type Entrypoint = GenericEntrypoint<CustomTransportServerOpts>;

