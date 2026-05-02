import type {OutputB} from "./task-b.types.js";
import type {RouteInput, Task} from "./utils.js";

export type BaseTaskA = Task & ((input: RouteInput) => Promise<OutputB & {a: string}>);
