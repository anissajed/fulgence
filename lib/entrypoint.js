import {buildApi} from './api.js';
import {buildConfig, getRawConfig} from "./config/load-config.js";
import {getServer} from './config/use-config.js';

export const entrypoint = async (opts) => {
  const {name, server_opts, config_path = ""} = opts;

  const raw_config = await getRawConfig(opts);

  const api = await buildApi({
    local_module_name: name,
    config: raw_config,
    config_path,
  });

  const config = buildConfig({raw_config, config_path});
  const server = await getServer({name, config});

  const shell = server({
    opts: server_opts,
    api,
    name,
  });

  return {server: shell, api};
}
