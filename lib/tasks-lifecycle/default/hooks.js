/** @type import("../types.js").OnInitTask */
export const onInitTask = async ({module, api}) => module.default;

/** @type import("../types.js").OnDoTask */
export const onDoTask = async ({task, api}) => (input) => task(input, api);
