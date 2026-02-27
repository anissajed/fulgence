import entrypoint from "../../../index.js";

const {CHUNK_NAME: name, PORT: port = 3010} = process.env;
const config_path = new URL("./api-config.json", import.meta.url).pathname;

const taskProxy = ({task}) => {
  const proxy = new Proxy(task, {
    get: function (target, prop) {
      return (arg) => target({
        operation: prop,
        arg,
      });
    },
  });
  return proxy;
};

const objectOrientedApi = ({api}) => {
  const proxy = new Proxy(api, {
    get: function (target, prop) {
      if (!target[prop]) return undefined;

      return taskProxy({task: target[prop]});
    },
  });
  return proxy;
};

const onInitTask = async ({module, api}) => {
  const Template = module.default;

  const oo_api = objectOrientedApi({api});

  const task = new Template({api: oo_api});
  return task;
};

const onDoTask = async ({task, input, api}) => {
  if (!input?.operation) throw new Error("The asked task execution has no associated operation");

  return task[input.operation](input.arg);
};

const runServer = async () => {
  const {server, api} = await entrypoint({
    name,
    config_path,
    port,
    onInitTask,
    onDoTask,
  });

  const oo_api = objectOrientedApi({api});
  return {server, api: oo_api};
};
export default runServer;
