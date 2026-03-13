/** @type import("../types").OnInitTask */
export const onInitTask = async ({module, api}) => module.default;

/** @type import("../types").OnDoTask */
export const onDoTask = async ({task, input, api}) => task(input, api);
