import { Injectable } from '@nestjs/common';
import {getApi} from "../api";
import {SpecificOnDoTaskArgInput} from "../with-fulgence";

@Injectable()
export class FulgenceService {
  async handle(payload: SpecificOnDoTaskArgInput & {task_name: string}) {
    const api = getApi();
    const {task_name, operation, arg} = payload;
    const task = api[task_name];
    return task?.[operation]?.(arg);
  }
}
