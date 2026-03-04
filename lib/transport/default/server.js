import http from 'http';
import {REQ_MAX_SIZE_BYTES} from "../../constants.js";

const requestBody = (req, req_max_size_bytes = 0) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();

    if (req_max_size_bytes && body.length > req_max_size_bytes) {
      const err = new Error("Request body too large");
      reject(err);
    }
  });
  req.on('end', () => {
    let body_obj = null;
    try {
      body_obj = JSON.parse(body);
    } catch (error) {
      return reject(new Error("Request body is not valid JSON"));
    }
    resolve(body_obj);
  });
});

const rootPostRequestController = async ({
  req,
  res,
  api,
  req_max_size_bytes,
  onRequest = (body, req) => body,
  beforeResponseSent = (data) => data,
}) => {
  const task_name = req.url.replace(/^\//, "");
  const task = api[task_name];
  let input = await requestBody(req, req_max_size_bytes);
  input = await onRequest(input, req);

  let result = await task(input);
  result = await beforeResponseSent(result);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const result_serialized = JSON.stringify(result);
  res.end(result_serialized);
}

const rootPostRequestControllerWrapper = async ({
  req,
  res,
  api,
  req_max_size_bytes,
  onRequest,
  beforeResponseSent,
}) => {
  try {
    await rootPostRequestController({
      req,
      res,
      api,
      req_max_size_bytes,
      onRequest,
      beforeResponseSent,
    });
  } catch (error) {
    res.statusCode = 200;
    const err_label = error.toString ? error.toString() : "Unknown error";
    const err_body = JSON.stringify({error: err_label});
    res.end(err_body);
  }
};

const handleNotFound = (req, res) => {
  res.statusCode = 404;
  res.end();
}

export const shell = ({
  api,
  port = 3000,
  req_max_size_bytes = REQ_MAX_SIZE_BYTES,
  onReady = (port) => {},
  onRequest,
  beforeResponseSent,
}) => {
  const tasks_urls = Object.keys(api).map((task_name) => "/" + task_name);
  const server = http.createServer(async (req, res) => {
    if (req.method != "POST" || !tasks_urls.includes(req.url)) {
      return handleNotFound(req, res);
    }

    await rootPostRequestControllerWrapper({
      req,
      res,
      api,
      req_max_size_bytes,
      onRequest,
      beforeResponseSent,
    });
  });

  server.listen(port, () => onReady(port));

  return server;
}
