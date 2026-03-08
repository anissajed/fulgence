# Basic example with authentication
This example shows you how to add auth with the default transport in distributed mode. It is based on the basic example.

Note that if you change the transport, the protection of the inter-modules communication will be configured differently; please see the documentation of each transport.

## Prerequisites
Please see first the Prerequisites for the basic example.

After that, run `npm install` to install this example's packages.

## Run

### Monolith mode
Since in this example the monolith mode does not use inter-modules authentication, its result will be similar to the monolith mode in the basic example.

If you want still to run it, you should prepare a Docker Compose file inspired from `docker-compose.yml`, but with 1 service/container and without `CHUNK_NAME` set.

### Distributed mode
```
$ docker compose up
...
task-a  | Run module a on chunk "a"
task-a  | Sending request with token in header authorization on chunk a
task-b  | On chunk b, successfully verified the caller's JWT
task-b  | Run module b on chunk "b"
task-b  | Sending request with token in header authorization on chunk b
task-c  | On chunk c, successfully verified the caller's JWT
task-c  | Run module c on chunk "c"
task-a  | Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```
