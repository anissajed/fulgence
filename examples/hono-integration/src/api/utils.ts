import type {Task} from "../tasks/utils.js";

export type TasksDict = Record<string, Task>;

type FulgenceApiTask<T extends (input: any) => any> = 
  T extends (input: infer I) => infer O
    ? (input: I) => Promise<Awaited<O>>
    : never;

export type FulgenceApi<Tasks extends TasksDict> = {
  [K in keyof Tasks]: FulgenceApiTask<Tasks[K]>
}
