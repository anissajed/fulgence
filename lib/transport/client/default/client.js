/** @typedef {import("./client.types").ClientWithPlugin} ClientWithPlugin */
/** @type ClientWithPlugin */
export const withPlugin = (plugin, baseClient) => {
  const client = (dest_opts) => async (raw_body = {}) => {
    let body = raw_body;
    let fetch_opts = {};
    if (plugin.beforeRequest) {
      ({body, fetch_opts} = await plugin.beforeRequest({body, fetch_opts, dest_opts}));
    }
    let result = await baseClient(dest_opts)(body, fetch_opts);
    if (plugin.onResponse) {
      result = await plugin.onResponse(result);
    }
    return result;
  }

  return client;
}

/** @typedef {import("./client.types").DefaultClient} DefaultClient */
/** @type DefaultClient */
export const client = ({name, url}) => async (body = "", fetch_opts = {}) => {
  const response = await fetch(url + "/" + name, {
    ...fetch_opts,
    method: "POST",
    body: JSON.stringify(body),
  });
  const result = await response.json();

  return result;
};
