# Custom transport example

This example shows you the simplest way to split modules and unify them. It is based on the basic example.

The default transport uses http webservers to communicate. The framework can use other protocols, but it's up to you to develop your own server (with Express.js? gRPC? Nest?) and the associated network caller. 

## Prerequisites
Please see first the Prerequisites for the basic example.

Next, install the example dependencies (in this directory): `npm install`.

## Run

### Monolith mode
Since the monolith mode doesn't use the transports, it is equivalent to the monolith mode in the basic example.

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
The default transport is located in `../../../transport/default/index.js` (relative to `api-config.json`), so it is equivalent in `api-config.json` to set this value or let the field unset.

On a "real use case", to set your transport you could use this kind of shortcut:
```
// transport.js
export * from "<this package>/default-transport";

// api-config.json
...
  "defaults": {
    "transport": "./transport.js"
  },
...
```
