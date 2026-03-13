interface TaskConfig {
  file: string;
  url: string;
};
interface RawConfig {
  tasks_lifecycle?: string;
  transport_client?: string;
  transport_server?: string;
  tasks: Record<string, TaskConfig>;
};

type Config = RawConfig & {
  config_path: string,
  basepath: string,
};
interface BuildConfigOpts {
  raw_config: RawConfig;
  config_path?: string;
};
export type BuildConfig = (opts: BuildConfigOpts) => Config;

export type RawConfigLoader = (config_path: string) => Promise<RawConfig>;

type GetRawConfigOptsConfigPath = {
  config_path: string;
};
type GetRawConfigOptsConfig = {
  config: RawConfig;
};
export type GetRawConfigOpts = GetRawConfigOptsConfigPath | GetRawConfigOptsConfig;
export type GetRawConfig = (opts: GetRawConfigOpts) => RawConfig;

