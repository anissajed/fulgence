import {objectOrientedApi} from "./oo-api.js";

export const onInitTask = async ({module, api}) => {
  const Template = module.default;

  const oo_api = objectOrientedApi({api});

  const task = new Template({api: oo_api});
  return task;
};

export const onDoTask = async ({task, input, api}) => {
  if (!input?.operation) throw new Error("The asked task execution has no associated operation");

  return task[input.operation](input.arg);
};
