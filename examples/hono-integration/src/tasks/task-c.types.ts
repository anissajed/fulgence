import type {RouteInput, Task} from "./utils.js";

export type OutputC = RouteInput & {c: string};

export type BaseTaskC = Task & ((input: RouteInput) => Promise<OutputC>);
