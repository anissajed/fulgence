import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {Api} from "../api/api.types.js";
import type {BaseTaskA} from "./task-a.types.js";
import type {FulgenceTaskImpl} from "./utils.js";
const name = basename(fileURLToPath(import.meta.url));

type TaskA = FulgenceTaskImpl<BaseTaskA, Api>;
const task_a: TaskA = async (input, api) => {
  console.log(`Run module ${name} on chunk "${process.env.CHUNK_NAME}"`);
  const res = await api.chunk_b(input);
  return {
    ...res,
    a: "a",
  };
};
export default task_a;
