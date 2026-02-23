import runServer, {callEntrypoint} from "./api/api.js";
runServer();

if ([undefined, "", "a"].includes(process.env.CHUNK_NAME)) {
  setTimeout(async () => {
    const payload = {
      example: true,
    };
    const res = await callEntrypoint(payload);
    console.log("Final result:", res);
  }, 2000);
}
