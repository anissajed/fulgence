import {DockerComposeEnvironment, StartedTestContainer} from "testcontainers";

export type StartDCFAndWaitForLog = (opts: {
  dcf_dirname: string,
  dcf_basename: string,
  service: string,
  text: string,
}) => Promise<DockerComposeEnvironment>;

export type StopDCF = (opts: {environment: DockerComposeEnvironment}) => Promise<void>;

export type WaitLogContaining = (
  container: StartedTestContainer,
  text: string,
  timeout_ms?: number
) => Promise<string>;

export type ExpectLogFromContainer = (opts: {
  environment: DockerComposeEnvironment,
  container_name: string,
  text: string,
  timeout?: number,
}) => Promise<void>;

export type TestDCFAgainstString = (opts: {
  dcf_dirname: string,
  dcf_basename: string,
  service: string,
  container_name: string,
  text: string,
}) => () => void;
