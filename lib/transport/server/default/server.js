import http from 'http';

export const server = () => {
  const server = http.createServer(async (req, res) => {});
  server.listen(3000);

  return server;
}
