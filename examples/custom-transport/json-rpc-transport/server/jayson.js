// @ts-ignore
import jayson from "jayson";

const prepareRequest = ({req: {body}}) => body;

const handleResponseFactory = ({res, next}) => (err, response) => {
  if (err) {
    // if err is an Error, err is NOT a json-rpc error
    if (err instanceof Error) return next(err);

    const error = new Error(err?.toString() || JSON.stringify(err));
    return next(error);
  }

  if (!response) {
    // empty response (could be a notification)
    res.status(204);
    res.send("");
    return;
  }

  res.send(response);
};

const callbackify = (method) => async (args, callback) => {
  let result;
  try {
    result = await method(args);
  } catch (error) {
    callback(error);
    return;
  }
  callback(null, result);
};

const mapValues = ({obj, mapper}) =>  Object.fromEntries(
  Object.entries(obj)
    .map(([name, value]) => [name, mapper(value)])
);

export const baseJaysonMethods = ({api}) => {
  const wrapped_map = mapValues({
    obj: api,
    mapper: callbackify,
  });
  return wrapped_map;
}

export const jsonRpcMiddlewareFactory = ({methods, endpoint = undefined}) => {
  const server = new jayson.Server(methods);

  const middleware = (req, res, next) => {
    const request = prepareRequest({req});
    const handleResponse = handleResponseFactory({res, next});
    server.call(request, handleResponse);
  };
  return middleware;
};
