/** @typedef {import("./load-config.types.js").RawConfigLoader} RawConfigLoader */
/** @type RawConfigLoader */
export const defaultFileLoader = async (config_path) => {
  throw new Error("The browser environment has no default config loader. Please provide your own implementation.");
};
