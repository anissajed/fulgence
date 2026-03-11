export default async (input, api) => {
  console.log(`Run module a on chunk "${process.env.CHUNK_NAME}"`);
  return {
    ...input,
    a: "a",
  };
};
