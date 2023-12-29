import defaultShell from './shell.js';
import defaultFetchWrapper from './fetch-endpoint.js';

export const CONFIG_UNIFIED_URL_ATTR = "unified-url";
export const CONFIG_SHELL_ATTR = "shell";
export const CONFIG_FETCH_ATTR = "fetch";
export const CONFIG_URL_ATTR = "url";
export const CONFIG_FILE_ATTR = "file";
export const CONFIG_DEFAULTS_ATTR = "defaults";
export const CONFIG_TASKS_ATTR = "tasks";
export const CONFIG_ENTRYPOINT_ATTR = "entrypoint";
export const MODULE_DEFAULTS = {
  [CONFIG_SHELL_ATTR]: defaultShell,
  [CONFIG_FETCH_ATTR]: defaultFetchWrapper,
};
