import {buildApi} from './api.js';
import {buildConfig, getRawConfig} from "./config/load-config.js";
import {getServer} from './config/use-config.js';

/** @typedef {import("./entrypoint.types.js").InitServer} InitServer */
/** @type InitServer */
export const initServer = async (opts) => {
  const {
    name,
    server_opts,
    raw_config,
    config_path = "",
    api = null,
  } = opts;

  const config = buildConfig({raw_config, config_path});
  const server = await getServer({name, config});

  const shell = server({
    opts: server_opts,
    api,
    name,
  });

  return shell;
}

/** @typedef {import("./transport/server/default/server.types.js").DefaultServerSpecificOpts} DefaultServerSpecificOpts */
/** @typedef {import("./entrypoint.types.js").Entrypoint<any>} Entrypoint */
/** @type Entrypoint */
export const entrypoint = async (opts) => {
  const {name, server_opts} = opts;
  const config_path = 'config_path' in opts ? opts.config_path : "";

  const raw_config = await getRawConfig(opts);

  const api = await buildApi({
    local_module_name: name,
    config: raw_config,
    config_path,
  });

  const shell = initServer({
    server_opts,
    raw_config,
    config_path,
    api,
    name,
  });

  return {server: shell, api};
}
