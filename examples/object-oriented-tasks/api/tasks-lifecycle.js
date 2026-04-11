import {objectOrientedApi} from "./oo-api.js";

/** @type import("../types.js").OnInitTask */
export const onInitTask = async ({module, api}) => {
  const Template = module.default;

  const oo_api = objectOrientedApi({api});

  const task = new Template({api: oo_api});
  return task;
};

/** @type import("../types.js").OnDoTask */
export const onDoTask = async ({task, api}) => (input) => {
  if (!input?.operation) throw new Error("The asked task execution has no associated operation");

  return task[input.operation](input.arg);
};
