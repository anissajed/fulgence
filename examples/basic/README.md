# Basic example

This example shows you the simplest way to split modules and unify them. It is built around modules `a.js`, `nested/b.js` and `nested/c.js`.

The default transport uses http webservers to communicate. The framework can use other protocols, but it's up to you to develop your own server (with Express.js? gRPC? Nest?) and the associated network caller. 


## Prerequisites
First, ensure you have Docker installed (it will be used to run the example in the distributed mode).

Then, install the lib dependencies - something like `cd ../..; npm install`.

After that, don't forget to go again in this example folder to run it.

## Run

### Monolith mode
Note: the server listens by default on the 3010 port. Ensure the port is accessible - or change it with the PORT env var - before running the server.
```
$ node ./index.js
...
Run module a on chunk "undefined"
Run module b on chunk "undefined"
Run module c on chunk "undefined"
Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```

#### Troubleshooting
First, ensure `CHUNK_NAME` is empty with something like `CHUNK_NAME="" node ./index.js`.

### Distributed mode
```
$ docker-compose up
...
task-a  | Run module a on chunk "a"
task-b  | Run module b on chunk "b"
task-c  | Run module c on chunk "c"
task-a  | Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```

## Notes
This example is more a proof-of-concept than a production-ready guide; in particular, there is no authentication in the inter-chunks communication. To enable auth (with the default transport), please see the `basic-with-auth` example.
