export default (input, api) => {
  console.log(`Run module c on chunk "${process.env.CHUNK_NAME}"`);
  return {
    ...input,
    c: "c",
  };
};
