import jayson from "jayson/promise/lib/index.js";

export const clientFactory = ({name, url}) => async (opts) => {
  const client = jayson.Client.http(url);
  
  const response = await client.request(name, opts);
  if (response.error) {
    throw new Error(response.error);
  }

  return response.result;
};
