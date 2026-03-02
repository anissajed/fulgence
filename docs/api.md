## API

### `entrypoint()`

`entrypoint()` bootstraps a module (or a monolith) and optionally accepts lifecycle hooks to customize how tasks are initialized and executed.
This allows you to implement tasks in either a functional or object-oriented style, add global error handling, or introduce cross-cutting behavior.

```ts
import entrypoint from "fulgence";

const {
  server,
  api,
} = await entrypoint({
  name,        // Module name (e.g. "a"). Leave undefined for monolith mode.
  config_path, // Path to the config file (e.g. "/home/me/my-project/config.json").
  port,        // Port on which this chunk (or monolith) listens (e.g. 80).
  // <arbitrary args>
});
```

#### Returns

- **`server`** — The underlying server instance for your task(s)/chunk(s).  
  It is exposed to allow low-level customization if needed.  
  Its shape depends on the selected transport (see your transport documentation).

- **`api`** — A client instance used to call tasks (see **Client API** below).

#### Additional arguments

`<arbitrary args>` are transport-specific options used to customize the server/runtime environment.  
Refer to your selected transport documentation for details.

---

### `buildApi()`

`buildApi()` is primarily intended for environments where `entrypoint()` is not called (for example, when running a standalone client executable).

```ts
import {buildApi} from "fulgence";

const api = await buildApi({
  local_module_name, // Module name (e.g. "a"). Leave undefined for monolith mode.
  config_path,       // Path to the config file (e.g. "/home/me/my-project/api-config.json").
});
```

The returned `api` instance is described in the **Client API** section below.

---

### Client API

The `api` object provides access to every module declared in the configuration file.
- If the target module is local, the call is executed directly.
- If the target module is remote, the call is executed through the configured transport.

This behavior is fully transparent to the caller.

For example, call task/chunk "b" with some input:
```ts
const result = await api.b(input);
```

The same `api` interface is:
- Passed to each module, enabling inter-module communication.
- Shared between chunks and monolith mode.
- Returned by `entrypoint()`.
- Creatable independently via `buildApi()`.

The shape of the `api` object can be customized via the Tasks Lifecycle Plugin (see below), as demonstrated in `examples/object-oriented-tasks`.

---

### Config File

> ⚠️ TODO

Currently, the configuration file must be a JSON file.

---

### Transport

> ⚠️ TODO

---

### Tasks Lifecycle Plugin

The Tasks Lifecycle Plugin allows you to customize how tasks are initialized and executed.

A plugin must export two hooks:

- `onInitTask`
- `onDoTask`

Default behavior:
```ts
onInitTask: async ({ module, api }) => module.default
onDoTask: async ({ task, input, api }) => task(input, api)
```

#### `onInitTask`
Default behavior:
```ts
onInitTask: async ({ module, api }) => module.default
```

- Runs immediately after the JavaScript module containing the task is imported.
- Must return the initialized task, ready to be executed.
- The returned value can be of any type.
- The returned task is later passed to `onDoTask`.

#### `onDoTask`
Default behavior:
```ts
onDoTask: async ({ task, input, api }) => task(input, api)
```

- Defines how the task is executed.
- Receives the initialized task returned by `onInitTask`.
- Its return value is forwarded to the caller (subject to potential transport middlewares).

#### Example
A complete example of a custom lifecycle plugin is available in:

```
examples/object-oriented-tasks
```

The plugin is declared in the configuration file (see the **Config File** section).
