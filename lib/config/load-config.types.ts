interface TaskConfig {
  file: string;
  url: string;
};
interface RawConfig {
  tasks_lifecycle?: string;
  transport?: string;
  tasks: Record<string, TaskConfig>;
};
export type Config = RawConfig & {
  config_path: string,
  basepath: string,
};
export type RawConfigLoader = (config_path: string) => Promise<RawConfig>;
export type LoadConfig = (opts: {path: string, loader?: RawConfigLoader}) => Promise<Config>;
