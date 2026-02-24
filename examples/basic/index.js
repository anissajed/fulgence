import runServer, {getApi} from "./api/api.js";
runServer();

if ([undefined, "", "a"].includes(process.env.CHUNK_NAME)) {
  setTimeout(async () => {
    const api = await getApi();
    const payload = {
      example: true,
    };
    const res = await api.a(payload);
    console.log("Final result:", res);
  }, 2000);
}
