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

const doTask = async ({task, input, api}) => {
  const res = {
    result: null,
    error: null,
  };

  try {
    res.result = await task(input, api);
  } catch (err) {
    res.error = err;
  }

  return res;
};

const rootPostRequestController = async ({req, res, api, req_max_size_bytes}) => {
  const task_name = req.url.replace(/^\//, "");
  const task = api[task_name];
  const body = await requestBody(req, req_max_size_bytes);

  const response_body = await doTask({task, api, input: body});
  const response_body_str = JSON.stringify(response_body);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(response_body_str);
}

const handleNotFound = (req, res) => {
  res.statusCode = 404;
  res.end();
}

export const shell = ({
  api,
  port = 3000,
  req_max_size_bytes = REQ_MAX_SIZE_BYTES,
  onReady = (port) => {},
}) => {
  const tasks_urls = Object.keys(api).map((task_name) => "/" + task_name);
  const server = http.createServer(async (req, res) => {
    if (req.method != "POST" || !tasks_urls.includes(req.url)) {
      return handleNotFound(req, res);
    }

    await rootPostRequestController({
      req,
      res,
      api,
      req_max_size_bytes,
    });
  });

  server.listen(port, () => onReady(port));
}
