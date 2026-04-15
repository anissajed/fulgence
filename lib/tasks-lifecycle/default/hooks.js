/** @type import("../types.js").OnInitTask */
export const onInitTask = async ({module, api}) => module.default;

/** @type import("../types.js").OnDoTask */
export const onDoTask = ({task, api}) => (input, extra) => task(input, extra ?? api);
