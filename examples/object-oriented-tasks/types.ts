import {
  OnInitTask as BaseOnInitTask,
  OnDoTask as BaseOnDoTask,
  Api,
} from "fulgence";

interface OOTaskConstructorArg {
  api: Record<string, Api>;
};
export interface OOTask {
  new (opt: OOTaskConstructorArg);
}
 
interface SpecificOnInitTaskArg {
  module: {
    default: OOTask;
  };
};
type SpecificOnInitTask = (arg: SpecificOnInitTaskArg) => unknown;
export type OnInitTask = BaseOnInitTask & SpecificOnInitTask;

interface SpecificOnDoTaskArg {
  task: OOTask;
  input: {
    operation: string;
    arg: unknown;
  };
};
type SpecificOnDoTask = (arg: SpecificOnDoTaskArg) => unknown;
export type OnDoTask = BaseOnDoTask & SpecificOnDoTask;
