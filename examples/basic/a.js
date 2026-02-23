export default async (input, api) => {
  console.log(`Run module a on chunk "${process.env.CHUNK_NAME}"`);
  const res = await api.b(input, api);
  return {
    ...res,
    a: "a",
  };
};
