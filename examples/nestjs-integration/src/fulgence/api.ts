import path from "path";
import {buildApi} from "fulgence";
import {config} from "./config.js";

class ValueHandler {
  value = null;
  callbacks: Function[] = [];
  resolve: Function = () => {};
  prom: Promise<any> = Promise.resolve();

  constructor() {
    this.prom = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  get () {
    return this.value;
  }

  getPromise () {
    return this.prom;
  }

  addCallback (cb) {
    return this.callbacks.push(cb);
  }

  set (value) {
    if (this.value) return;

    this.value = value;
    this.resolve(value);
    this.callbacks.forEach((cb) => cb(this.value));
  }
}
export const api_handler = new ValueHandler();

export const initApi = async () => {
  const api = await buildApi({
    local_module_name: process.env.CHUNK_NAME,
    config_path: path.join(__dirname, "./api-config.virtual.json"),
    config,
  }) as unknown;

  return api;
}


type Api = Record<string, Record<string, (...args: any[]) => any>>;
export const getApi = () => {
  const api = api_handler.get() as unknown as Api;
  if (!api) {
    throw new Error("API not ready")
  }

  return api;
};
