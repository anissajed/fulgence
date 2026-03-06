/** @typedef {import("./hooks.types").OnInitTask} OnInitTask */
/** @type OnInitTask */
export const onInitTask = async ({module, api}) => module.default;

/** @typedef {import("./hooks.types").OnDoTask} OnDoTask */
/** @type OnDoTask */
export const onDoTask = async ({task, input, api}) => task(input, api);
