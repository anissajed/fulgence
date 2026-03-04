import {generateJWT, verifyJWT} from "./auth.js";

const name = process.env.CHUNK_NAME;
const header_name = "authorization";

export const auth_plugin = {
  beforeRequest: async ({body, fetch_opts, dest_opts}) => {
    const jwt = await generateJWT({sub: name});
    fetch_opts.headers = {
      ...(fetch_opts.headers || {}),
      [header_name]: `Bearer ${jwt}`,
    };
    return {body, fetch_opts};
  },
  onRequest: async (data, req) => {
    const auth_header = req.headers?.[header_name] || "";
    const token = auth_header.replace(/^Bearer\ /, "");
    await verifyJWT(token);
    console.log(`On chunk ${name}, successfully verified the caller's JWT`);

    return data;
  },
};
