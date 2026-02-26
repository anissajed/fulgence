# Default transport

This transport is build around a lean POST request, and a vanilla NodeJS HTTP server.

It exists essentially for illustration purposes, and is not production ready. Despite its simplicity, it is highly extensible with hooks.

## Limitations
Task responses are expected to be valid JSON.

## Extending
Several hooks allow to customize the transport behaviour.

### Example
There is an example at `../examples/basic-with-auth/api/transport.js` .

### Hooks
This transport accepts hooks. They can be used e.g. to add authentication.

#### beforeRequest
Default: `async ({body, fetch_opts, dest_opts}) => ({body, fetch_opts})`

In the client (the "caller" part of the transport), allows to transform the argument (fetch body) of a call - and configure the HTTP fetch - before doing it.

It can be used e.g. to serialize the body, or to add auth args in headers.

#### onRequest
Default: `async (input) => input`

In the server (the "called" part of the transport), allows to transform the argument/input of a call before passing it to the task.

#### beforeResponseSent
Default: `async (result) => result`

In the server (the "called" part of the transport), allows to transform the result of a task before sending it back to the caller.

#### onResponse
Default: `async (result) => result`

In the client (the "caller" part of the transport), allows to transform the result of a call before passing it to the initial caller.

#### Hooks execution order
|  Timeline  | ---------------> | ---------------> | -----> | -----------------> | ---------------> |
|------------|------------------|------------------|--------|--------------------|------------------|
| executable |      caller      |      called      | called |       called       |      caller      |
| section    | transport client | transport server |  task  |  transport server  | transport client |
| hook       | beforeRequest    |     onRequest    |        | beforeResponseSent |    onResponse    |

#### Multiples plugins and hooks execution order
When several plugins are stacked together, their hooks are executed in the most transparent order (the one that better limit interactions between plugins).
On such a situation, we want 2 plugins to transform and un-transform during the transport:
```
const plugin_1 = {
  beforeRequest: transformToC,
  onRequest: undoCTransformation,
  beforeResponseSent: transformToE,
  onResponse: undoETransformation,
};
const plugin_2 = {
  beforeRequest: transformToB,
  onRequest: undoBTransformation,
  beforeResponseSent: transformToD,
  onResponse: undoDTransformation,
};

const transport_with_p1 = transport.withPlugin(plugin_1, transport);
const transport_with_p1_p2 = transport.withPlugin(plugin_2, transport);

export default transport_with_p1_p2;
```
In the exported transport, the hooks will be executed in this order (in parenthesis the current state of the data, starting with initial argument A and the initial task response R):
1. transformToB (B(A))
2. transformToC (C(B(A)))
3. undoCTransformation (B(A))
4. undoBTransformation (A)

(the task execution transforms A to R)

5. transformToD (D(R))
6. transformToE (E(D(R)))
7. undoETransformation (D(R))
8. undoDTransformation (R)

With such an order the received response is thus R, and there is no (bad) interactions between plugins.
