import path from 'path';
import {
  CONFIG_FILE_ATTR,
  CONFIG_URL_ATTR,
  CONFIG_TASKS_ATTR,
  CONFIG_ENTRYPOINT_ATTR,
} from '../constants.js';

const validateConfig = (config_json) => {
  if (!config_json) {
    throw new Error("Config check: no config");
  }

  const {
    [CONFIG_ENTRYPOINT_ATTR]: entrypoint,
    [CONFIG_TASKS_ATTR]: tasks,
  } = config_json;

  if (!entrypoint || !tasks) {
    throw new Error("Config check: lacking mandatory root field");
  }

  if (!tasks[entrypoint]) {
    throw new Error("Config check: entrypoint is not a task id");
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

const loadConfig = async (config_path) => {
  const module = await import(config_path, {
    with: {
      type: 'json',
    },
  });

  const config = module.default;
  validateConfig(config);
  return config;
}

export default loadConfig;
