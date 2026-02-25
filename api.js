import path from 'path';
import {
  loadTask,
  refinedConfig,
  getClientFactory,
  getTask,
} from "./config/use-config.js";

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

const localApi = async ({config, basepath}) => {
  const {tasks} = refinedConfig(config);
  let api = {};
  api = await makeApi(tasks, async ({name, task_config}) => {
    const task = await loadTask({task_config, basepath});
    return task;
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

export const buildApi = async ({local_module_name = "", config, config_path}) => {
  const getRawApi = !!local_module_name ? remoteApi : localApi;
  
  const basepath = path.dirname(config_path);
  const api = await getRawApi({config, basepath});

  if (local_module_name) {
    const task = await getTask({
      name: local_module_name,
      config,
      config_path,
    });
    const callTask = (input) => task(input, api);
    api[local_module_name] = callTask;
  }

  return api;
}
