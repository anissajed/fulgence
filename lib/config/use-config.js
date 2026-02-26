import path from 'path';
import * as defaultTransportAttr from "../transport/default/index.js";
import {
  CONFIG_TASKS_ATTR,
  CONFIG_DEFAULTS_ATTR,
  CONFIG_FILE_ATTR,
  CONFIG_TRANSPORT_ATTR,
  CONFIG_URL_ATTR,
} from '../constants.js';

const loadPath = async ({loadable_path, basepath}) => {
  let loadable = loadable_path;
  if (loadable.startsWith(".")) {
    loadable = path.join(basepath, loadable);
  }
  const module = await import(loadable);
  return module;
};

export const refinedConfig = (config) => {
  const {
    [CONFIG_DEFAULTS_ATTR]: defaults,
    [CONFIG_TASKS_ATTR]: tasks,
  } = config;
  return {defaults, tasks};
};

export const taskConfig = ({config, name}) => {
  const {tasks} = refinedConfig(config);

  const {
    [CONFIG_URL_ATTR]: url,
    [CONFIG_FILE_ATTR]: file,
    [CONFIG_TRANSPORT_ATTR]: transport,
  } = tasks[name];

  return {url, file, transport};
}

export const loadTask = async ({task_config, basepath}) => {
  const loadable_path = task_config[CONFIG_FILE_ATTR];
  const module = await loadPath({loadable_path, basepath});
  const loaded = module.default;
  return loaded;
}

const MODULE_DEFAULTS = {
  [CONFIG_TRANSPORT_ATTR]: defaultTransportAttr,
};
const loadDefaultAttr = async ({config, basepath, attribute}) => {
  if (!config[CONFIG_DEFAULTS_ATTR]?.[attribute]) {
    return MODULE_DEFAULTS[attribute];
  }

  const loadable_path = config[CONFIG_DEFAULTS_ATTR][attribute];
  const module = await loadPath({loadable_path, basepath});
  return module;
}

export const getClientFactory = async ({config, basepath}) => {
  const transport_attr = await loadDefaultAttr({
    config,
    basepath,
    attribute: CONFIG_TRANSPORT_ATTR,
  });
  return transport_attr?.clientFactory;
}

export const getShell = async ({name, config}) => {
  const transport_attr = await loadDefaultAttr({
    config,
    basepath: path.dirname(config.config_path),
    attribute: CONFIG_TRANSPORT_ATTR,
  });
  return transport_attr?.shell;
};
