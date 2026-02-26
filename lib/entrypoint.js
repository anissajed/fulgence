import {buildApi} from './api.js';
import {getShell} from './config/use-config.js';

export const entrypoint = async ({
  name,
  config,
  config_path,
  ...rest
}) => {
  const api = await buildApi({
    local_module_name: name,
    config,
    config_path,
  });

  const shell = await getShell({name, config, config_path});

  const server = shell({
    ...rest,
    api,
  });

  return {server, api};
}
