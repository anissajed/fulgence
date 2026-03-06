import {buildApi} from './api.js';
import {loadConfig} from "./config/load-config.js";
import {getShell} from './config/use-config.js';

/** @typedef {import("./entrypoint.types").Entrypoint} Entrypoint */
/** @type Entrypoint */
export const entrypoint = async ({
  name,
  config_path,
  config: _config,
  ...rest
}) => {
  const config = _config || await loadConfig({path: config_path});

  const api = await buildApi({
    local_module_name: name,
    config,
  });

  const shell = await getShell({name, config});

  const server = shell({
    ...rest,
    api,
    name,
  });

  return {server, api};
}
