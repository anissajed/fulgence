export const onInitTask = async ({module, api}) => module.default;
export const onDoTask = async ({task, input, api}) => task(input, api);
