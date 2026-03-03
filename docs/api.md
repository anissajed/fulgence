## API

### `entrypoint()`
`entrypoint()` bootstraps a task/module - or all the tasks/modules for a monolith.
```ts
import entrypoint from "fulgence";

const {
  server,
  api,
} = await entrypoint({
  name,
  config_path,
  port,
  // <arbitrary args>
});
```

#### Arguments
- **name** - Module name (e.g. "task-a"). Leave undefined for monolith mode.
- **config_path** - Path to the config file (e.g. `/home/me/my-project/config.json`).
- **port** - Port on which this chunk (or monolith) listens (e.g. 80).

- **Additional arguments** - `<arbitrary args>` are transport-specific options used to configure the server/runtime.
Refer to your selected transport documentation for details.

#### Returns
- **`server`** — The underlying server instance hosting the task(s).
  It is exposed for advanced customization if needed.
  It is the output of the `shell()` hook of the selected transport (see Transport section).

- **`api`** — A client instance used to call tasks (see **Client API** below).

---

### `buildApi()`
`buildApi()` is intended for environments where `entrypoint()` is not executed (for example, in a standalone client process).

```ts
import {buildApi} from "fulgence";

const api = await buildApi({
  local_module_name,
  config_path,
});
```

#### Arguments
- **local_module_name** - Module name (e.g. "task-a"). Leave undefined for monolith mode.
- **config_path** - Path to the config file (e.g. `/home/me/my-project/config.json`).

#### Returns
The returned `api` instance is described in the **Client API** section below.

#### Overload
Instead of providing `config_path`, you may pass a preloaded configuration object:
```ts
import {buildApi, loadConfig} from "fulgence";

const config = await loadConfig(config_path);

const api = await buildApi({
  local_module_name,
  config,
});
```

---

### `loadConfig()`
`loadConfig()` loads and resolves a configuration object from a given `config_path`.

```ts
import {loadConfig} from "fulgence";

const config = await loadConfig(config_path);
```

#### Arguments
- **config_path** - Path to the config file (e.g. `/home/me/my-project/config.json`).

#### Returns
The returned `config` object can be passed to `buildApi()` or used programmatically.

---

### Client API
The `api` object provides access to every module declared in the configuration file:

- If the target module is local, the call is executed directly.
- If the target module is remote, the call is performed through the configured transport.

This behavior is fully transparent to the caller.

```ts
const result = await api.b(input);
```

The same `api` interface is:
- Passed to each module, enabling inter-module communication.
- Returned by `entrypoint()`.
- Creatable independently via `buildApi()`.

The shape of the `api` object can be customized via the Tasks Lifecycle Plugin (see below), as demonstrated in `examples/object-oriented-tasks`.

---

### Config File
The configuration file defines:
- Which tasks are available
- Where they are loaded from (file path) when they should be locally loded
- How they are reached in distributed mode
- Which Transport Plugin and Tasks Lifecycle Plugin are used (optional)

Example configuration (all optional fields included):
```json
{
  "tasks_lifecycle": "./tasks-lifecycle.js",
  "transport": "./transport.js",
  "tasks": {
    "a": {
      "file": "./task-a.js",
      "url": "http://task-a-service:3000"
    },
    "b": {
      "file": "./nested/task-b.js",
      "url": "http://task-b-service:3000"
    }
  }
}
```

#### Fields

##### `tasks`
A dictionary where keys are task/module names and values are task configuration objects.

##### `tasks.<task>.file`
Path (relative to the config file) to the task/module implementation.
Used when the task is loaded locally.

##### `tasks.<task>.url`
Remote URL from the caller’s perspective of the task/module when running in distributed mode.
Used when the task is not loaded locally.

##### `tasks_lifecycle` (optional)
Path (relative to the config file) to a Tasks Lifecycle Plugin.

##### `transport` (optional)
Path (relative to the config file) to a Transport Plugin.

#### Notes
Currently, the configuration file must be JSON.
Support for additional formats (e.g. JS, YAML) may be added in the future.

---

### Transport
The Transport Plugin defines how inter-task communication works in distributed mode.
It is also responsible for declaring the server implementation in monolith mode.

The default transport is the combination of a (fetch) POST call with a vanilla nodejs server.

Fulgence is transport-agnostic: you may implement your own server layer (e.g. Express, gRPC, NestJS) along with a compatible client.

#### Custom Transport: Transport Plugin
A transport plugin must export two hooks:

- `shell()`
- `clientFactory()`

The plugin is declared in the configuration file (see the **Config File** section).

##### `shell()`
Creates the server hosting the task(s).

```ts
async function shell({port, ...<arbitrary args>}) {
  return server;
}
```

##### `clientFactory()`
Creates a client for a given remote task, or all tasks in monolith mode.

```ts
async clientFactory({
  name, // Name of the called task/module (from config)
  url,  // Remote URL of the called task/module (from config)
}) => async (request_args) => result
```

#### Example
A complete example of a custom Transport Plugin is available in `examples/custom-transport` .

---

### Tasks Lifecycle Plugin
The Tasks Lifecycle Plugin customizes via hooks how tasks are initialized and executed.

This enables functional or object-oriented task definitions, global error handling, logging, or other cross-cutting concerns.

A plugin must export two hooks:

- `onInitTask`
- `onDoTask`

The plugin is declared in the configuration file (see the **Config File** section).

#### `onInitTask`
Default behavior:
```ts
onInitTask: async ({module, api}) => module.default
```

- Runs immediately after the task/module is imported.
- Must return the initialized task, ready to be executed.
- The returned value can be of any type.
- The returned task is later passed to `onDoTask`.

#### `onDoTask`
Default behavior:
```ts
onDoTask: async ({task, input, api}) => task(input, api)
```

- Defines how the task is executed.
- Receives the initialized task returned by `onInitTask`.
- Its return value is forwarded to the caller.

#### Example
A complete example of a custom Tasks Lifecycle Plugin is available in `examples/object-oriented-tasks` .
