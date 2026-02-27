import path from 'path';
import * as defaultTransportAttr from "../transport/default/index.js";
import {
  CONFIG_TASKS_ATTR,
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
    [CONFIG_TRANSPORT_ATTR]: transport,
    [CONFIG_TASKS_ATTR]: tasks,
  } = config;
  return {transport, tasks};
};

export const taskConfig = ({config, name}) => {
  const {tasks} = refinedConfig(config);

  const {
    [CONFIG_URL_ATTR]: url,
    [CONFIG_FILE_ATTR]: file,
  } = tasks[name];

  return {url, file};
}

export const loadModule = async ({task_config, basepath}) => {
  const loadable_path = task_config[CONFIG_FILE_ATTR];
  const module = await loadPath({loadable_path, basepath});
  return module;
}

const CONFIG_DEFAULTS = {
  [CONFIG_TRANSPORT_ATTR]: defaultTransportAttr,
};
const loadRootAttr = async ({config, basepath, attribute}) => {
  if (!config[attribute]) {
    return CONFIG_DEFAULTS[attribute];
  }

  const loadable_path = config[attribute];
  const module = await loadPath({loadable_path, basepath});
  return module;
}

export const getClientFactory = async ({config, basepath}) => {
  const transport_attr = await loadRootAttr({
    config,
    basepath,
    attribute: CONFIG_TRANSPORT_ATTR,
  });
  return transport_attr?.clientFactory;
}

export const getShell = async ({name, config}) => {
  const transport_attr = await loadRootAttr({
    config,
    basepath: path.dirname(config.config_path),
    attribute: CONFIG_TRANSPORT_ATTR,
  });
  return transport_attr?.shell;
};
