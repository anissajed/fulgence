import path from 'path';
import {
  loadTask,
  refinedConfig,
  loadFetchWrapper,
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

const directApi = async ({config, basepath}) => {
  const {tasks} = refinedConfig(config);
  let api = {};
  api = await makeApi(tasks, async ({name, task_config}) => {
    const task = await loadTask({task_config, basepath});
    return task;
  });

  return api;
};

const fetchApi = async ({config, basepath}) => {
  const {tasks} = refinedConfig(config);

  const api = await makeApi(tasks, async ({name, task_config}) => {
    const fetchWrapper = await loadFetchWrapper({config, basepath});
    const fetchEndpoint = fetchWrapper({name, url: task_config.url});
    return fetchEndpoint;
  });

  return api;
};

export const loadApi = async ({local_module_name = "", config, config_path}) => {
  const getRawApi = !!local_module_name ? fetchApi : directApi;
  
  const basepath = path.dirname(config_path);
  const api = await getRawApi({config, basepath});

  if (local_module_name) {
    const task = await getTask({
      name: local_module_name,
      config,
      config_path,
    });
    const caller = (input) => task(input, api);
    api[local_module_name] = caller;
  }

  return api;
}
