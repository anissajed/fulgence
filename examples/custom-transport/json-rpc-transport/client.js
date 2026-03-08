// @ts-ignore
import jayson from "jayson/promise/lib/index.js";

export const client = ({name, url}) => async (opts) => {
  const jayson_client = jayson.Client.http(url);

  console.log("Will request Jayson server");
  const response = await jayson_client.request(name, opts);
  if (response.error) {
    throw new Error(response.error);
  }

  return response.result;
};
