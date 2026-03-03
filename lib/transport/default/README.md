# Default Transport
The default transport is built on top of a minimal HTTP layer:
- A lean `POST` request on the client side
- A vanilla Node.js HTTP server on the server side

It is primarily intended for illustration and experimentation.  
It is **not production-ready**.

Despite its simplicity, it is highly extensible through a well-defined hook system.

---

## API
### `shell()`
Creates the HTTP server hosting the task(s).

```ts
type Server = any;
type shell = ({port: number}) => Promise<Server>
```

- Used in monolith mode to host all tasks.
- Used in distributed mode to host a single module.
- Returns the underlying Node.js server instance.

---

### `clientFactory()`
Creates a client function for a given remote task (or for all tasks in monolith mode).

```ts
async function clientFactory({name, url}) {
  return async function request(request_args = {}) {
    return result;
 };
}
```
```ts
type ModuleRequest = (request_args: any) => Promise<any>;
type shell = ({name: string, url: URL|string}) => ModuleRequest;
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
The default transport exposes several hooks that allow you to customize its behavior (for example, to add authentication, encryption, logging, or custom serialization).

### Example
A basic extension example is available at `../examples/basic-with-auth/api/transport.js` .

---

### Hooks
Hooks are executed at specific stages of the request/response lifecycle.

They can be used symmetrically on the client (caller) and server (called) sides.

---

#### `beforeRequest`
Default:
```ts
async ({request_args, fetch_opts, dest_opts}) => ({request_args, fetch_opts})
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

#### `onRequest`
Default:
```ts
async (input) => input
```

Executed on the **server side** (the "called"), before the task is invoked.

Allows you to transform or deserialize the request payload before passing it to the task.

---

#### `beforeResponseSent`
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

#### `onResponse`
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

#### Hooks Execution Order
The lifecycle of a request is:

| Stage        | Side     | Layer              | Hook                |
|-------------|----------|-------------------|---------------------|
| 1           | Caller   | Transport Client   | `beforeRequest`     |
| 2           | Called   | Transport Server   | `onRequest`         |
| 3           | Called   | Task Execution     | —                   |
| 4           | Called   | Transport Server   | `beforeResponseSent`|
| 5           | Caller   | Transport Client   | `onResponse`        |

Legend:
- **Transport Client** → implementation returned by `clientFactory()`
- **Transport Server** → implementation created by `shell()`

---

#### Multiple Plugins & Hook Ordering
When multiple plugins are stacked, hooks are executed in a symmetric and predictable order to prevent unwanted interactions.

The goal is to allow each plugin to:
1. Transform data on the way in
2. Undo its transformation on the way out

Example:
```ts
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

Execution order for an initial argument `A` and task response `R`:

##### Request phase
1. `transformToB` → `B(A)`
2. `transformToC` → `C(B(A))`
3. `undoCTransformation` → `B(A)`
4. `undoBTransformation` → `A`

(Task execution transforms `A` into `R`)

##### Response phase
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
