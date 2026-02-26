# Basic example with authentication

This example shows you how to add auth with the default transport in distributed mode. It is based on the basic example.

Note that if you change the transport, the protection of the inter-modules communication will be configured differently; please see the documentation of each transport.

## Prerequisites
Please see first the Prerequisites for the basic example.

After that, run `npm install` to install this example's packages.

## Run

### Monolith mode
Since in this example the monolith mode does not use inter-modules authentication, it is equivalent to the monolith mode in the basic example.

### Distributed mode
```
$ docker compose up
...
task-a  | Run module a on chunk "a"
task-b  | On chunk b, successfully verified the caller's JWT
task-b  | Run module b on chunk "b"
task-c  | On chunk c, successfully verified the caller's JWT
task-c  | Run module c on chunk "c"
task-a  | Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```

## Notes
The default transport is located in `../../../lib/transport/default/index.js` (relative to `api-config.json`); it is equivalent in `api-config.json` to set this value (as it is currently set in the file) or let the field unset.
