import {Server as GenericServer, Entrypoint as GenericEntrypoint} from "fulgence";
import {DefaultServerSpecificOpts} from "fulgence/transport/server/default";
type CustomTransportServerOpts = Pick<DefaultServerSpecificOpts, "port" | "onReady">;

export type Server = GenericServer<CustomTransportServerOpts>;

export type Entrypoint = GenericEntrypoint<CustomTransportServerOpts>;

