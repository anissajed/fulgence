import http from "http";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

const errorHandler = function(err, req, res, next) {
  console.log("Catched express error:");
  console.error(err);
  let {message, stack, status} = err;
  const error_html = JSON.stringify({message, stack, status}, null, 0);

  res.status(err.status || 500);
  res.send(error_html);
};

const notFoundHandler = (req, res, next)  => res.sendStatus(404);

export const createApp = ({router}) => {
  const app = express();

  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(router)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

const createServer = ({app, port, name = "Monolith"}) => {
  const server = http.createServer(app);
  server.listen(port);
  server.on("listening", () => {
    // @ts-ignore
    const {port} = server.address();
    console.log(name + ", Initialization: Listening on port " + port);
  });

  return server;
};

export const createExpressServer = ({port, name, router}) => {
  const app = createApp({router});
  const server = createServer({app, port, name});

  return server;
};
