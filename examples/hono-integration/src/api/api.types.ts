import type {Entrypoint as GenericEntrypoint} from "fulgence";
import type {BaseTaskA} from "../tasks/task-a.types.js";
import type {BaseTaskB} from "../tasks/task-b.types.js";
import type {BaseTaskC} from "../tasks/task-c.types.js";
import type {FulgenceApi, TasksDict} from "./utils.js";

interface Tasks extends TasksDict {
  chunk_a: BaseTaskA;
  chunk_b: BaseTaskB;
  chunk_c: BaseTaskC;
};
export type Api = FulgenceApi<Tasks>;


export type CustomTransportServerOpts = {
  port: number | string;
  onReady: (opts: {api: Api}) => void;
};

export type Entrypoint = GenericEntrypoint<CustomTransportServerOpts>;
