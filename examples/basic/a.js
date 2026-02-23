export default async (input, api) => {
  const res = await api.b(input, api);
  return {
    ...res,
    a: "a",
  };
};
