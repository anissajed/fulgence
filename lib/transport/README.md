## Default Transport
The default transport is built on top of a minimal HTTP layer:
- A lean `POST` request on the client side
- A vanilla Node.js HTTP server on the server side

It is primarily intended for illustration and experimentation.
It is **not production-ready**.

Despite its simplicity, it is highly extensible through a well-defined hook system.

---

## Server Plugin API

### `server()`
Creates the HTTP server hosting the task(s).

```ts
type Server = unknown;
type server = ({port: number}) => Promise<Server>
```

- Used in monolith mode to host all tasks.
- Used in distributed mode to host a single module.
- Returns the underlying Node.js server instance.

---

## Client Plugin API

### `client()`
Creates a client function for a given remote task (or for all tasks in monolith mode).

```ts
async function client({name, url}) {
  return async function request(request_args = {}) {
    return result;
 };
}
```
```ts
type ModuleRequest = (request_args: unknown) => Promise<unknown>;
type Client = ({name: string, url: URL|string}) => ModuleRequest;
```

- `name` — The name of the called task/module (from the config file).
- `url` — The remote URL of the called module (from the config file).
- Returns an async function performing the HTTP request.

---

## Limitations
- Task responses must be valid JSON.
- No built-in authentication, retries, streaming, or advanced HTTP features.
- Intended as a reference implementation rather than a production transport.

---

## Extending the Transport
The default transport plugins exposes several hooks that allow you to customize their behavior (for example, to add authentication, encryption, logging, or custom serialization).

### Example
A basic extension example is available at `../examples/basic-with-auth/api/transport.js` .

---

### Hooks
Hooks are executed at specific stages of the request/response lifecycle.

They can be used symmetrically on the client (caller) and server (called) sides.

---

#### Client Plugin Hooks

##### `beforeRequest`
Default:
```ts
async ({body, fetch_opts, dest_opts}) => ({body, fetch_opts})
```

Executed on the **client side** (the "caller" part of the transport).

Allows you to:
- Transform the outgoing request body
- Modify HTTP `fetch` options (e.g. headers)
- Inject authentication metadata

Typical use cases:
- Serialize or encrypt the body
- Add authentication headers
- Add tracing metadata

---

##### `onResponse`
Default:
```ts
async (result) => result
```

Executed on the **client side** (caller), after receiving the HTTP response.

Allows you to:
- Transform or deserialize the result
- Unwrap a response envelope
- Decrypt the response

---

#### Server Plugin Hooks

##### `onRequest`
Default:
```ts
async (input) => input
```

Executed on the **server side** (the "called"), before the task is invoked.

Allows you to transform or deserialize the request payload before passing it to the task.

---

##### `beforeResponseSent`
Default:
```ts
async (result) => result
```

Executed on the **server side** (called), after task execution but before sending the response.

Allows you to:
- Transform or serialize the result
- Wrap the result in a custom envelope
- Encrypt the response

---

#### Hooks Execution Order
The lifecycle of a request is:

| Stage       | Layer           | Hook                |
|-------------|-----------------|---------------------|
| 1           | Client Plugin   | `beforeRequest`     |
| 2           | Server Plugin   | `onRequest`         |
| 3           | Task Execution  | —                   |
| 4           | Server Plugin   | `beforeResponseSent`|
| 5           | Client Plugin   | `onResponse`        |

---

#### Multiple Plugins & Hook Ordering
When multiple plugins are stacked, hooks are executed in a symmetric and predictable order to prevent unwanted interactions.

The goal is to allow each plugin to:
1. Transform data on the way in
2. Undo its transformation on the way out

Example:
```ts
// transport.client.js
import {client} from "fulgence/transport/client/default";

const plugin_1_client = {
  beforeRequest: transformToC,
  onResponse: undoETransformation,
};

const plugin_2_client = {
  beforeRequest: transformToB,
  onResponse: undoDTransformation,
};

const client_with_p1 = withPlugin(plugin_1, client);
const client_with_p1_p2 = withPlugin(plugin_2, client_with_p1);
export const client = client_with_p1_p2;

// transport.server.js
import {server} from "fulgence/transport/server/default";
const plugin_1_server = {
  onRequest: undoCTransformation,
  beforeResponseSent: transformToE,
};

const plugin_2_server = {
  onRequest: undoBTransformation,
  beforeResponseSent: transformToD,
};

const server_with_p1 = withPlugin(plugin_1, server);
const server_with_p1_p2 = withPlugin(plugin_2, server_with_p1);
export const server = server_with_p1_p2;
```

Execution order for an initial argument `A` and task response `R`:

***Request phase***
1. `transformToB` → `B(A)`
2. `transformToC` → `C(B(A))`
3. `undoCTransformation` → `B(A)`
4. `undoBTransformation` → `A`

(Task execution transforms `A` into `R`)

***Response phase***
5. `transformToD` → `D(R)`
6. `transformToE` → `E(D(R))`
7. `undoETransformation` → `D(R)`
8. `undoDTransformation` → `R`

The final response received by the caller is therefore `R`.

##### Properties
This ordering guarantees:
- Isolation between plugins
- Symmetric transformations
- No unintended cross-plugin side effects
