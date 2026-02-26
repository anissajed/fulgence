# Webservice splitter
In nodejs, provide a lightweight API that allows the same code to run in monolith mode or in distributed mode.

Switching between the 2 modes is made with only a variable, that e.g. may be driven by an environment variable.

The code is highly modulable, to be easily adapted to precise needs.

## Examples
```
// api-config.json
{
  "tasks": {
    "a": {
      "file": "./a.js",
      "url": "http://task-a:3001"
    },
    "b": {
      "file": "./b.js",
      "url": "http://localhost:3002"
    },
  }
}

// a.js
export default async (input, api) => ({
  ...(await api.b(input)),
  a: "a",
});

// index.js
const name = process.env.CHUNK_NAME;
const {api} = await entrypoint({
  name,
  config_path: "./api-config.json",
  port: process.env.PORT,
});
if (!name || name == "a") {
  const result = await api.a({"arg": "initial argument"});
  console.log("Result:", result);
}

// shell, distributed mode
$ PORT=3000 CHUNK_NAME=b node ./index.js &
$ PORT=3001 CHUNK_NAME=a node ./index.js &
# Result: <depends on your tasks>

// shell, monolith mode
$ PORT=3002 node ./index.js &
# Result: <depends on your tasks>
```

### More examples, full examples
Please see `examples` folder.

## Warnings
Currently, the inter-modules communication serializes the calls results between modules calls with a "data" serialization, so there is no form of typing or prototyping on the received data. So if you typed the result in the called module, you have to re-type it in the calling module; pay attention if in your code you count on tricks like `if (call_result instanceof CustomClass)`.

Also, transports have their own limitations, please see the documentation of the transport you use. The default transport documentation is located in `transport/default/README.md`.

## API

### entrypoint
`entrypoint()` accepts hooks, to customise the way a task is initialized and called. Thus, you can choose to write a task in functional or object-oriented style, add global error handling, etc.

```
import entrypoint from "<this package>";
const {
  server,
  api, // returns a client to call the tasks. More details in "client api".
} = await entrypoint({
  name, // module name (e.g. "a"), let undefined for monolith mode
  config_path, // the path of the manifest, e.g. "/home/me/my-project/manifest.json"
  port, // the port where you want this chunk (or monolith) to listen, e.g. 80
  <arbitrary args>
});
```

Returned `server` object is your task(s)/chunk(s) server. It is returned essentially to allow you to hack it if you need to. It depends on the transport you choose in your manifest.

`<arbitrary args>` are transport-specific values to customize the server/shell; cf the documentation of your transport for more details.

### buildApi
```
import {buildApi} from "<this package>";
const api = await buildApi({
  local_module_name, // module name (e.g. "a"), let undefined for monolith mode
  config_path, // the path of the manifest, e.g. "/home/me/my-project/manifest.json"
});
```
More details on the returned `api` object in `client api` section.

### client api
It can call every module declared in the manifest. If the module is a local one, it's a direct call; else it's a remote call. The way it is done is as transparent as possible for the caller.

It is the API passed to each module to allow them to call other modules - and it is the same interface for chunks and monolith. It can be invoked "standalone" with `buildApi`. It is also returned by `entrypoint()`.

```
// Call task/chunk "b" with some input arg:
const res = await api.c(input);
```

### manifest
TODO

#### transport
TODO

