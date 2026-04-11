/** @type import("../types.js").OnInitTask */
export const onInitTask = async ({module, api, local}) => module.default;

/** @type import("../types.js").OnDoTask */
export const onDoTask = async ({task, api, local}) => (input) => task(input, api);
