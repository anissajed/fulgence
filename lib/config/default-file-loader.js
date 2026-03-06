import {createRequire} from "module";
const require = createRequire(import.meta.url);

/** @typedef {import("./load-config.types").RawConfigLoader} RawConfigLoader */
/** @type RawConfigLoader */
export const defaultFileLoader = async (config_path) => {
  const config = require(config_path);
  return config;
};
