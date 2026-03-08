import path from 'path';
import {
  CONFIG_FILE_ATTR,
  CONFIG_URL_ATTR,
  CONFIG_TASKS_ATTR,
  CONFIG_TRANSPORT_CLIENT_ATTR,
  CONFIG_TRANSPORT_SERVER_ATTR,
  CONFIG_TASKS_LIFECYCLE_ATTR,
} from '../constants.js';
import {defaultFileLoader} from "./default-file-loader.js";

const validateTasksConfigs = ({tasks}) => {
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

const validateRawConfig = (config_json) => {
  if (!config_json) {
    throw new Error("Config check: no config");
  }

  const {
    [CONFIG_TASKS_ATTR]: tasks,
  } = config_json;

  if (!tasks) {
    throw new Error("Config check: lacking mandatory root field");
  }

  validateTasksConfigs({tasks});
}

const buildConfig = ({raw_config, config_path}) => {
  const {
    [CONFIG_TRANSPORT_CLIENT_ATTR]: transport_client,
    [CONFIG_TRANSPORT_SERVER_ATTR]: transport_server,
    [CONFIG_TASKS_LIFECYCLE_ATTR]: tasks_lifecycle,
    [CONFIG_TASKS_ATTR]: tasks,
  } = raw_config;

  const basepath = path.dirname(config_path);

  const config = {
    transport_client,
    transport_server,
    tasks_lifecycle,
    tasks,
    config_path,
    basepath,
  };
  return config;
}

/** @typedef {import("./load-config.types").LoadConfig} LoadConfig */
/** @type LoadConfig */
export const loadConfig = async ({
  path: config_path = "",
  loader = defaultFileLoader,
}) => {
  if (!config_path || typeof config_path != "string") {
    throw new Error("config_path must be a valid path");
  }

  const raw_config = await loader(config_path);

  validateRawConfig(raw_config);

  const config = buildConfig({raw_config, config_path});
  return config;
}
