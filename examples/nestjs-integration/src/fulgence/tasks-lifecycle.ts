import {
  OnInitTask as BaseOnInitTask,
  OnDoTask as BaseOnDoTask,
  Api,
} from "fulgence";
import {
  instances_handler,
} from "./with-fulgence.js";
import {withProxyMethods} from "./utils.js";


interface OOTaskConstructorArg {
  api: Record<string, Api>;
};
interface OOTask {
  new (opt: OOTaskConstructorArg);
}
interface SpecificOnInitTaskArg {
  module: {
    [x: string]: OOTask;
  };
};
type SpecificOnInitTask = (arg: SpecificOnInitTaskArg) => unknown;
type OnInitTask = BaseOnInitTask & SpecificOnInitTask;

export const onInitTask: OnInitTask = async ({module, api, local}) => {
  const exports = Object.entries(module["module.exports"] || module);
  if (exports.length != 1) {
    throw new Error("A task file should have exactly 1 export");
  }
  
  const [task_name] = exports[0];

  const instance = instances_handler.firstOfType(task_name);

  if (local) {
    return instance;
  }

  const requester = module.default;
  const proxyFunction = ({name, original}) => (arg) => {
    return requester({
      operation: name,
      arg,
    });
  }

  const Client = withProxyMethods({proxyFunction})(instance);

  return Client;
};

interface SpecificOnDoTaskArg {
  task: OOTask;
};
type SpecificOnDoTask = (arg: SpecificOnDoTaskArg) => unknown;
type OnDoTask = BaseOnDoTask & SpecificOnDoTask;

export const onDoTask: OnDoTask = async ({task: instance, api}) => {
  return instance;
};
