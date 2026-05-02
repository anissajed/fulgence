export default async (input, api) => {
  console.log(`Run module b on chunk "${process.env.CHUNK_NAME}"`);
  const res = await api.c(input);
  return {
    ...res,
    b: "b",
  };
};
