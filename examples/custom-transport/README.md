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
It's the same way as the distributed mode in the basic example, with same expected results.

## Notes
The default transport is located in `../../../transport/default/index.js` (relative to `api-config.json`), so it is equivalent in `api-config.json` to set this value (as it is currently set in the file) or let the field unset.

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
