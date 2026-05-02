import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {Api} from "../api/api.types.js";
import type {BaseTaskB} from "./task-b.types.js";
import type {FulgenceTaskImpl} from "./utils.js";
const name = basename(fileURLToPath(import.meta.url));

type TaskB = FulgenceTaskImpl<BaseTaskB, Api>;
const task_b: TaskB = async (input, api) => {
  console.log(`Run module ${name} on chunk "${process.env.CHUNK_NAME}"`);
  const res = await api.chunk_c(input);
  return {
    ...res,
    b: "b",
  };
};
export default task_b;
