export default async (input, api) => {
  const res = await api.c(input, api);
  return {
    ...res,
    b: "b",
  };
};
