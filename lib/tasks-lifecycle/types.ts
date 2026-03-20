import {Api} from "../api.types.js";

type Task = any;
export type OnInitTask = (opts: {module, api: Api, local: boolean}) => Promise<Task>;
export type OnDoTask = (opts: {
  task: Task,
  input: unknown,
  api: Api,
  local: boolean,
}) => Promise<unknown>;
