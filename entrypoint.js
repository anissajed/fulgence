import {loadApi} from './api.js';
import {getTask, getShell} from './config/use-config.js';

export const entrypoint = async ({
  name,
  config,
  config_path,
  ...rest
}) => {
  const api = await loadApi({
    local_module_name: name,
    config,
    config_path,
  });

  const shell = await getShell({name, config, config_path});

  return shell({
    ...rest,
    api,
  });
}
