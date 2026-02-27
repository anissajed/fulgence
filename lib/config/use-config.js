import path from 'path';
import * as defaultTransportAttr from "../transport/default/index.js";
import * as defaultTasksLifecycleAttr from "../tasks-lifecycle/default/index.js";
import {
  CONFIG_TASKS_ATTR,
  CONFIG_FILE_ATTR,
  CONFIG_TRANSPORT_ATTR,
  CONFIG_TASKS_LIFECYCLE_ATTR,
  CONFIG_URL_ATTR,
} from '../constants.js';

const loadPath = async ({loadable_path, basepath}) => {
  if (typeof loadable_path != "string") {
    throw new Error("loadable_path must be a valid path");
  }

  let loadable = loadable_path;
  if (loadable.startsWith(".")) {
    loadable = path.join(basepath, loadable);
  }
  try {
    const module = await import(loadable);
    return module;
  } catch (error) {
    throw new Error("Can't load file at path " + loadable);
  }
};

export const taskConfig = ({config, name}) => {
  const {
    [CONFIG_URL_ATTR]: url,
    [CONFIG_FILE_ATTR]: file,
  } = config.tasks[name];

  return {url, file};
}

export const loadModule = async ({task_config, basepath}) => {
  const loadable_path = task_config[CONFIG_FILE_ATTR];
  const module = await loadPath({loadable_path, basepath});
  return module;
}

const CONFIG_DEFAULTS = {
  [CONFIG_TRANSPORT_ATTR]: defaultTransportAttr,
  [CONFIG_TASKS_LIFECYCLE_ATTR]: defaultTasksLifecycleAttr,
};
const loadRootAttr = async ({config, attribute}) => {
  if (!config[attribute]) {
    return CONFIG_DEFAULTS[attribute];
  }

  const loadable_path = config[attribute];
  const {basepath} = config;
  const module = await loadPath({loadable_path, basepath});
  return module;
}

export const getClientFactory = async ({config}) => {
  const transport_attr = await loadRootAttr({
    config,
    attribute: CONFIG_TRANSPORT_ATTR,
  });

  if (typeof transport_attr?.clientFactory != "function") {
    throw new Error("Selected transport has a bad-formed clientFactory.");
  }

  return transport_attr?.clientFactory;
}

export const getShell = async ({name, config}) => {
  const transport_attr = await loadRootAttr({
    config,
    attribute: CONFIG_TRANSPORT_ATTR,
  });

  if (typeof transport_attr?.shell != "function") {
    throw new Error("Selected transport has a bad-formed shell.");
  }

  return transport_attr?.shell;
};

export const getTasksLifecycle = async ({name, config}) => {
  const tasks_lifecycle_attr = await loadRootAttr({
    config,
    attribute: CONFIG_TASKS_LIFECYCLE_ATTR,
  });

  if (typeof tasks_lifecycle_attr?.onInitTask != "function") {
    throw new Error("Selected tasks lifecycle plugin has a bad-formed onInitTask.");
  }

  if (typeof tasks_lifecycle_attr?.onDoTask != "function") {
    throw new Error("Selected tasks lifecycle plugin has a bad-formed onDoTask.");
  }

  return tasks_lifecycle_attr;
};
