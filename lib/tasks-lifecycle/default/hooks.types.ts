import {Api} from "../../api.types";

type Task = unknown;
export type OnInitTask = (opts: {module, api: Api}) => Promise<Task>;
export type OnDoTask = (opts: {task: Task, input: unknown, api: Api}) => Promise<unknown>;
