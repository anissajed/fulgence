import runServer from "./api/api.js";

const onReady = ({api}) => {
  if ([undefined, "", "a"].includes(process.env.CHUNK_NAME)) {
    setTimeout(async () => {
      const payload = {
        example: true,
      };
      const res = await api.a.addAttributes(payload);
      console.log("Final result:", res);
    }, 2000);
  }
};
await runServer({onReady});
