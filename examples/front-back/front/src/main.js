import {loadConfig, buildApi} from "fulgence/client";
import raw_config from "./api/api-config.js";

const config = await loadConfig({path: "local", loader: async () => raw_config});

const api = await buildApi({
  // Note: If you to set an empty string in local_module_name,
  // fulgence will assume you want the monolith mode.
  // So you have to set a non-empty string that is not a task/module name.
  local_module_name: "front",
  config,
});
const payload = {
  example: true,
};
const res = await api.a(payload);
const text = "Final result: " + JSON.stringify(res);
document.querySelector('#result').textContent = text;
