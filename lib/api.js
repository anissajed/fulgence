import path from 'path';
import {
  loadModule,
  refinedConfig,
  getClientFactory,
} from "./config/use-config.js";
import {loadConfig} from "./config/load-config.js";

const localTaskCaller = async ({
  task_config,
  basepath,
  api,
  onInitTask = async ({module, api}) => module.default,
  onDoTask = async ({task, input, api}) => task(input, api),
}) => {
  const module = await loadModule({task_config, basepath});
  const task = await onInitTask({module, api});
  const callTask = (input) => onDoTask({task, input, api});
  return callTask;
};

const makeApi = async (tasks, taskCallerFactory) => {
  const tasks_entries_proms = Object.entries(tasks).map(
    async ([name, task_config]) => {
      const taskCaller = await taskCallerFactory({name, task_config});
      return [name, taskCaller];
    }
  );

  const tasks_entries = await Promise.all(tasks_entries_proms);
  return Object.fromEntries(tasks_entries);
};

const localApi = async ({
  config,
  basepath,
  onInitTask,
  onDoTask,
}) => {
  const {tasks} = refinedConfig(config);
  let api = {};
  await makeApi(tasks, async ({name, task_config}) => {
    const callTask = await localTaskCaller({
      task_config,
      basepath,
      api,
      onInitTask,
      onDoTask,
    });
    api[name] = callTask;
    return callTask;
  });

  return api;
};

const remoteApi = async ({config, basepath}) => {
  const {tasks} = refinedConfig(config);

  const api = await makeApi(tasks, async ({name, task_config}) => {
    const clientFactory = await getClientFactory({config, basepath});
    const callTask = clientFactory({name, url: task_config.url});
    return callTask;
  });

  return api;
};

export const buildApi = async ({
  local_module_name = "",
  config: _config = null,
  config_path = null,
  onInitTask,
  onDoTask,
}) => {
  const config = _config || await loadConfig(config_path);

  const getRawApi = !!local_module_name ? remoteApi : localApi;

  const basepath = path.dirname(config.config_path);
  const api = await getRawApi({
    config,
    basepath,
    onInitTask,
    onDoTask,
  });

  if (local_module_name) {
    const {tasks} = refinedConfig(config);
    const task_config = tasks[local_module_name];
    api[local_module_name] = await localTaskCaller({
      task_config,
      basepath,
      api,
      onInitTask,
      onDoTask,
    });
  }

  return api;
}
