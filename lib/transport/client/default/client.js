/** @typedef {import("./client.types.js").ClientWithPlugin} ClientWithPlugin */
/** @type ClientWithPlugin */
export const withPlugin = (plugin, baseClient) => (dest_opts) => {
  const baseRequester = baseClient(dest_opts);

  const newRequester = async (raw_body = {}) => {
    let body = raw_body;
    let fetch_opts = {};
    if (plugin.beforeRequest) {
      ({body, fetch_opts} = await plugin.beforeRequest({body, fetch_opts, dest_opts}));
    }
    let result = await baseRequester(body, fetch_opts);
    if (plugin.onResponse) {
      result = await plugin.onResponse(result);
    }
    return result;
  };

  return newRequester;
}

/** @typedef {import("./client.types.js").DefaultClient} DefaultClient */
/** @type DefaultClient */
const client = ({name, url}) => async (body = "", fetch_opts = {}) => {
  const response = await fetch(url + "/" + name, {
    ...fetch_opts,
    method: "POST",
    body: JSON.stringify(body),
  });
  const result = await response.json();

  return result;
};
export default client;
