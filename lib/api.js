import {
  loadModule,
  getClient,
  getTasksLifecycle,
} from "./config/use-config.js";
import {loadConfig} from "./config/load-config.js";

const localTaskCaller = async ({
  task_config,
  basepath,
  api,
  onInitTask,
  onDoTask,
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
  onInitTask,
  onDoTask,
}) => {
  const {basepath, tasks} = config;
  const api = {};
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

const remoteApi = async ({config, onInitTask, onDoTask}) => {
  const api = await makeApi(config.tasks, async ({name, task_config}) => {
    const client = await getClient({config});
    const callTask = client({name, url: task_config.url});
    return callTask;
  });

  return api;
};

export const buildApi = async ({
  local_module_name = "",
  config: _config = null,
  config_path = null,
}) => {
  const config = _config || await loadConfig({path: config_path});

  if (!config) throw new Error("Config not found");

  const getRawApi = local_module_name ? remoteApi : localApi;

  const {onInitTask, onDoTask} = await getTasksLifecycle({name: local_module_name, config});

  const api = await getRawApi({config, onInitTask, onDoTask});

  const {tasks, basepath} = config;
  const task_config = tasks[local_module_name];
  if (task_config) {
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
