import path from 'path';
import {
  CONFIG_FILE_ATTR,
  CONFIG_URL_ATTR,
  CONFIG_TASKS_ATTR,
  CONFIG_TRANSPORT_ATTR,
} from '../constants.js';

const validateConfig = (config_json) => {
  if (!config_json) {
    throw new Error("Config check: no config");
  }

  const {
    [CONFIG_TASKS_ATTR]: tasks,
  } = config_json;

  if (!tasks) {
    throw new Error("Config check: lacking mandatory root field");
  }

  const falsy_task = Object.values(tasks).some((task) => !task);
  if (falsy_task) {
    throw new Error("Config check: a task is falsy");
  }

  const lacking_file_in_task = Object.entries(tasks).some(
    ([id, task]) => !task[CONFIG_FILE_ATTR]
  );
  if (lacking_file_in_task) {
    throw new Error(`Config check: a task lacks the mandatory field '${CONFIG_FILE_ATTR}'`);
  }

  const lacking_url_in_task = Object.entries(tasks).some(
    ([id, task]) => !task[CONFIG_URL_ATTR]
  );
  if (lacking_url_in_task) {
    throw new Error(`Config check: a task lacks the mandatory field '${CONFIG_URL_ATTR}'`);
  }
}

export const loadConfig = async (config_path) => {
  if (typeof config_path != "string") {
    throw new Error("config_path must be a valid path");
  }

  const module = await import(config_path, {
    with: {type: 'json'},
  });

  const config = module.default;
  validateConfig(config);

  const {
    [CONFIG_TRANSPORT_ATTR]: transport,
    [CONFIG_TASKS_ATTR]: tasks,
  } = config;

  const basepath = path.dirname(config_path);

  return {
    transport,
    tasks,
    config_path,
    basepath,
  };
}
