import type {OutputC} from "./task-c.types.js";
import type {RouteInput, Task} from "./utils.js";

export type OutputB = OutputC & {b: string};

export type BaseTaskB = Task & ((input: RouteInput) => Promise<OutputB>);
