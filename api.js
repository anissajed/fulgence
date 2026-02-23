import path from 'path';
import {
  loadTask,
  refinedConfig,
  loadFetchWrapper,
} from "./config/use-config.js";

const makeApi = async (tasks, taskCallerFactory) => {
  const tasks_entries_proms = Object.entries(tasks).map(
    async ([name, task_config]) => {
      const taskCaller = await taskCallerFactory(task_config);
      return [name, taskCaller];
    }
  );

  const tasks_entries = await Promise.all(tasks_entries_proms);
  return Object.fromEntries(tasks_entries);
};

const directApi = async ({config, basepath}) => {
  const {tasks} = refinedConfig(config);
  const api = await makeApi(tasks, async (task_config) => {
    const task = await loadTask({task_config, basepath});
    return task;
  });

  return api;
};

const fetchApi = async ({config, basepath}) => {
  const {defaults, tasks, entrypoint} = refinedConfig(config);

  const api = await makeApi(tasks, async (task_config) => {
    const fetchWrapper = await loadFetchWrapper({task_config, defaults, basepath});
    const fetchEndpoint = fetchWrapper(task_config.url);
    return fetchEndpoint;
  });

  return api;
};

const loadApi = async ({use_fetch = false, config, config_path}) => {
  const getApi = use_fetch ? fetchApi : directApi;
  const basepath = path.dirname(config_path);
  const api = await getApi({config, basepath});

  return api;
}
export default loadApi;
