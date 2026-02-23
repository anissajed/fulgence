import path from 'path';
import defaultShell from '../transport/default/shell.js';
import defaultFetchWrapper from '../transport/default/fetch-endpoint.js';
import {
  CONFIG_TASKS_ATTR,
  CONFIG_DEFAULTS_ATTR,
  CONFIG_ENTRYPOINT_ATTR,
  CONFIG_UNIFIED_URL_ATTR,
  CONFIG_FILE_ATTR,
  CONFIG_SHELL_ATTR,
  CONFIG_FETCH_ATTR,
  CONFIG_URL_ATTR,
} from '../constants.js';

const loadTaskAttr = async ({task_config, basepath, attribute}) => {
  let loadable_path = task_config[attribute];
  if (loadable_path.startsWith(".")) {
    loadable_path = path.join(basepath, loadable_path);
  }
  const module = await import(loadable_path);
  return module;
};

export const refinedConfig = (config) => {
  const {
    [CONFIG_UNIFIED_URL_ATTR]: unified_url,
    [CONFIG_ENTRYPOINT_ATTR]: entrypoint,
    [CONFIG_DEFAULTS_ATTR]: defaults,
    [CONFIG_TASKS_ATTR]: tasks,
  } = config;
  return {unified_url, entrypoint, defaults, tasks};
};

export const taskConfig = ({config, name}) => {
  const {tasks} = refinedConfig(config);

  const {
    [CONFIG_URL_ATTR]: url,
    [CONFIG_FILE_ATTR]: file,
    [CONFIG_SHELL_ATTR]: shell,
    [CONFIG_FETCH_ATTR]: _fetch,
  } = tasks[name];

  return {url, file, shell, fetch: _fetch};
}

export const loadTask = async ({task_config, basepath}) => {
  const module = await loadTaskAttr({
    task_config,
    basepath,
    attribute: CONFIG_FILE_ATTR,
  });
  const loaded = module.default;
  return loaded;
}

const MODULE_DEFAULTS = {
  [CONFIG_SHELL_ATTR]: defaultShell,
  [CONFIG_FETCH_ATTR]: defaultFetchWrapper,
};
export const loadTaskAttrWithDefaults = async ({task_config, defaults, basepath, attribute}) => {
  if (!task_config?.[attribute] && !defaults?.[attribute]) {
    return MODULE_DEFAULTS[attribute];
  }

  const module = await loadTaskAttr({
    task_config: task_config?.[attribute] ? task_config : defaults,
    basepath,
    attribute,
  });

  const loaded = module.default;
  return loaded;
}

export const loadFetchWrapper = ({
  task_config,
  defaults,
  basepath,
}) => loadTaskAttrWithDefaults({
  task_config,
  defaults,
  basepath,
  attribute: CONFIG_FETCH_ATTR,
});

export const getTask = async ({name, config, config_path}) => loadTask({
  task_config: config[CONFIG_TASKS_ATTR][name],
  defaults: config[CONFIG_DEFAULTS_ATTR],
  basepath: path.dirname(config_path),
});

export const getShell = ({name, config, config_path}) => loadTaskAttrWithDefaults({
  task_config: config[CONFIG_TASKS_ATTR][name],
  defaults: config[CONFIG_DEFAULTS_ATTR],
  basepath: path.dirname(config_path),
  attribute: CONFIG_SHELL_ATTR,
});

export const getFetchWrapper = ({name, config, config_path}) => loadTaskAttrWithDefaults({
  task_config: config[CONFIG_TASKS_ATTR][name],
  defaults: config[CONFIG_DEFAULTS_ATTR],
  basepath: path.dirname(config_path),
  attribute: CONFIG_FETCH_ATTR,
});
