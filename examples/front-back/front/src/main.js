import {buildApi} from "fulgence/client";
import config from "./api/api-config.js";

const api = await buildApi({
  // Note: If you to set an empty string in local_module_name,
  // fulgence will assume you want the monolith mode.
  // So you have to set a non-empty string that is not a task/module name.
  local_module_name: "front",
  config,
  config_path: "./api/api-config.js",
});
const payload = {
  example: true,
};
const res = await api.a(payload);
const text = "Final result: " + JSON.stringify(res);
document.querySelector('#result').textContent = text;
