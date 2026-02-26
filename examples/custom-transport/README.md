# Custom transport example

This example shows you how to customize the transport in distributed mode. It is based on the basic example.

The default transport uses http webservers to communicate. The framework can use other protocols, but it's up to you to develop your own server (with Express.js? gRPC? Nest?) and the associated network caller. 

## Prerequisites
Please see first the Prerequisites for the basic example.

Next, install the example dependencies (in this directory): `npm install`.

## Run

### Monolith mode
Since the monolith mode doesn't use the transports, it is equivalent to the monolith mode in the basic example.

### Distributed mode
```
$ docker compose up
...
task-c  | c, Initialization: Listening on port 3000
task-b  | b, Initialization: Listening on port 3000
task-a  | a, Initialization: Listening on port 3000
task-a  | Run module a on chunk "a"
task-b  | Run module b on chunk "b"
task-c  | Run module c on chunk "c"
task-c  | POST / 200 28.601 ms - 95
task-b  | POST / 200 87.218 ms - 103
task-a  | Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```
