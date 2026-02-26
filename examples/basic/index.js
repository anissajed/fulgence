import runServer from "./api/api.js";
/* Note: if the client runs on an executable where entrypoint() is not
 * called (contrary to the present situation), we can invoke api with something like:
 * import {buildApi} from "<this package>";
 * const api = await buildApi({
 *   local_module_name: ...,
 *   config: ...,
 * });
 */
const {api} = await runServer();

if ([undefined, "", "a"].includes(process.env.CHUNK_NAME)) {
  setTimeout(async () => {
    const payload = {
      example: true,
    };
    const res = await api.a(payload);
    console.log("Final result:", res);
  }, 2000);
}
