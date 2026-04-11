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

/*
type GetRawConfigOptsConfigPath = {
  config_path: string;
};
type GetRawConfigOptsConfig = {
  config: RawConfig;
};

// This should be the most proper type to be used. But since TS can't understand this in the clients codes, we will export another simpler one. We keep this "more human readable version" here for documentation.
type GetRawConfigOpts = GetRawConfigOptsConfigPath | GetRawConfigOptsConfig | (GetRawConfigOptsConfigPath & GetRawConfigOptsConfig);
*/
export interface GetRawConfigOpts {
  config_path?: string;
  config?: RawConfig;
};
export type GetRawConfig = (opts: GetRawConfigOpts) => RawConfig;

