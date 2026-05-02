import type {Api} from "./api/api.types.js";
import {runServer} from "./api/api.js";

const onReady = ({api}: {api: Api}) => {
  if ([undefined, "", "chunk_a"].includes(process.env.CHUNK_NAME)) {
    setTimeout(async () => {
      const payload = {
        example: true,
      };
      const res = await api.chunk_a(payload);
      console.log("Final result:", res);
    }, 1000);
  }
};
runServer({onReady});
