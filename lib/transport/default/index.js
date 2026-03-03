export {clientFactory} from './client.js';
export {shell} from './server.js';

export const withPlugin = (plugin, transport) => {
  const shell = (input = {}) => transport.shell({
    ...input,
    onRequest: async (data, req) => {
      let res = data;
      if (plugin.onRequest) {
        res = plugin.onRequest(res, req);
      }
      if (input.onRequest) {
        res = input.onRequest(res, req);
      }
      return res;
    },
    beforeResponseSent: async (data) => {
      let res = data;
      if (input.onResponse) {
        res = input.beforeResponseSent(res);
      }
      if (plugin.onResponse) {
        res = plugin.beforeResponseSent(res);
      }
      return res;
    },
  });

  const clientFactory = (dest_opts) => async (raw_body = {}) => {
    let body = raw_body;
    let fetch_opts = {};
    if (plugin.beforeRequest) {
      ({body, fetch_opts} = await plugin.beforeRequest({body, fetch_opts, dest_opts}));
    }
    let result = await transport.clientFactory(dest_opts)(body, fetch_opts);
    if (plugin.onResponse) {
      result = await plugin.onResponse(result);
    }
    return result;
  }

  return {shell, clientFactory, withPlugin};
}
