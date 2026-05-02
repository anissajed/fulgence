import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {Api} from "../api/api.types.js";
import type {BaseTaskC} from "./task-c.types.js";
import type {FulgenceTaskImpl} from "./utils.js";
const name = basename(fileURLToPath(import.meta.url));

type TaskC = FulgenceTaskImpl<BaseTaskC, Api>;
const task_c: TaskC = async (input, api) => {
  console.log(`Run module ${name} on chunk "${process.env.CHUNK_NAME}"`);
  return {
    ...input,
    c: "c",
  };
};
export default task_c;
