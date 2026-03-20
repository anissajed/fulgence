import {
  loadModule,
  getClient,
  getTasksLifecycle,
} from "./config/use-config.js";
import {buildConfig, getRawConfig} from "./config/load-config.js";

/** @typedef {import("./api.types.js").LocalTaskCaller} LocalTaskCaller */
/** @type LocalTaskCaller */
const localTaskCaller = async ({
  task_config,
  basepath,
  api,
  onInitTask,
  onDoTask,
}) => {
  const module = await loadModule({task_config, basepath});
  const task = await onInitTask({module, api, local: true});
  const callTask = (input) => onDoTask({task, input, api, local: true});
  return callTask;
};

/** @typedef {import("./api.types.js").Api} Api */
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
  const api = /** @type {Api} */ ({});
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
  const api = /** @type {Api} */ ({});
  await makeApi(config.tasks, async ({name, task_config}) => {
    const clientFactory = await getClient({config});
    const module = {
      default: clientFactory({name, url: task_config.url}),
    };
    const doRequest = await onInitTask({module, api, local: false});
    const callTask = (input, extra) => onDoTask({
      task: (input, _) => doRequest(input, extra),
      input,
      api,
      local: false,
    });
    api[name] = callTask;
    return callTask;
  });

  return api;
};

/** @typedef {import("./api.types.js").BuildApi} BuildApi */
/** @type BuildApi */
export const buildApi = async (opts) => {
  const {local_module_name = ""} = opts;
  const config_path = 'config_path' in opts ? opts.config_path : "";

  const raw_config = await getRawConfig(opts);
  const config = buildConfig({raw_config, config_path});

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
