// @ts-ignore
import jayson from "jayson/promise/lib/index.js";

/** @type import("fulgence.js").Client */
const client = ({name, url}) => {
  const jayson_client = jayson.Client.http(url);

  const requester = async (opts) => {
    console.log("Will request Jayson server");
    const response = await jayson_client.request(name, opts);
    if (response.error) {
      throw new Error(response.error);
    }

    return response.result;
  };
  return requester;
};
export default client;
