/** @typedef {import("./load-config.types").RawConfigLoader} RawConfigLoader */
/** @type RawConfigLoader */
export const defaultFileLoader = async (config_path) => {
  throw new Error("defaultFileLoader is not supported in browser environment");
};
