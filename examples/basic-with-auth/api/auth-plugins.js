import {generateJWT, verifyJWT} from "./jwt.js";

const name = process.env.CHUNK_NAME;
const header_name = "authorization";

export const client_auth_plugin = {
  beforeRequest: async ({body, fetch_opts, dest_opts}) => {
    const jwt = await generateJWT({sub: name});
    console.log(`Sending request with token in header ${header_name} on chunk ${name}`);
    fetch_opts.headers = {
      ...(fetch_opts.headers || {}),
      [header_name]: `Bearer ${jwt}`,
    };
    return {body, fetch_opts};
  },
};

export const server_auth_plugin = {
  onRequest: async (data, req) => {
    const auth_header = req.headers?.[header_name] || "";
    const token = auth_header.replace(/^Bearer /, "");
    await verifyJWT(token);
    console.log(`On chunk ${name}, successfully verified the caller's JWT`);

    return data;
  },
};
