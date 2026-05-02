export default async (input, api) => {
  console.log(`Run module a on chunk "${process.env.CHUNK_NAME}"`);
  const res = await api.b(input);
  return {
    ...res,
    a: "a",
  };
};
