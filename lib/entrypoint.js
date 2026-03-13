import {buildApi} from './api.js';
import {loadConfig} from "./config/load-config.js";
import {getServer} from './config/use-config.js';

const getConfig = async (opts) => {
  if ('config' in opts) {
    return opts.config;
  }

  if ('config_path' in opts) {
    const config = await loadConfig({path: opts.config_path});
    return config;
  }

  throw new Error("At least one of 'config', 'config_path' fields is needed");
}

export const entrypoint = async (opts) => {
  const {name, server_opts} = opts;

  const config = await getConfig(opts);

  const api = await buildApi({
    local_module_name: name,
    config,
  });

  const server = await getServer({name, config});

  const shell = server({
    opts: server_opts,
    api,
    name,
  });

  return {server: shell, api};
}
