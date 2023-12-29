import loadApi from './api.js';
import loadConfig from './config/load-config.js';
import {getTask, getShell, refinedConfig, getFetchWrapper, taskConfig} from './config/use-config.js';

const splitterOpts = async ({name = "", config, config_path}) => {
  const api = await loadApi({
    use_fetch: !!name,
    config,
    config_path,
  });

  const shell = await getShell({name, config, config_path});

  const {entrypoint} = refinedConfig(config);
  let task = api[entrypoint];
  if (name) {
    task = await getTask({name, config, config_path});
  }

  return {shell, task, api};
}

const loadConfigIfNeeded = async (config_or_config_path) => {
  let config = config_or_config_path;

  if (typeof config_or_config_path == "string") {
    const config_path = config_or_config_path;
    config = await loadConfig(config_path);
  }

  return config;
}

const entrypoint = async ({
  name,
  config,
  config_path,
  ...rest
}) => {
  const {shell, task, api} = await splitterOpts({name, config, config_path});

  return shell({
    ...rest,
    task,
    api,
  });
}
export default entrypoint;

export const callEntrypointFactory = async ({config, config_path, name}) => {
  const {unified_url, entrypoint} = refinedConfig(config);
  const fetchWrapper = await getFetchWrapper({name: entrypoint, config, config_path});

  const task_config = taskConfig({config, name: entrypoint});
  const url = name ? task_config.url : unified_url || task_config.url;
  const caller = fetchWrapper(url);

  return caller;
};
