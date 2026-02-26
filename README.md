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
      "file": "../a.js",
      "url": "http://task-a:3001"
    },
    "b": {
      "file": "../nested/b.js",
      "url": "http://localhost:3002"
    },
  }
}

// index-a.js
...
const {api} = await entrypoint({
  name: "a",
  config_path: ...,
  config: ...,
  port: 3001,
});
const result = await api.a({"arg": "initial argument"});
console.log("Result:", result);

// index-b.js
await entrypoint({
  name: "b",
  config_path: ...,
  config: ...,
  port: 3002,
});

// shell
$ node ./index-b.js &
$ node ./index-a.js &
# Result: { arg: "initial argument", b: 'b', a: 'a' }
```

### More examples, full examples
Please see `examples` folder.

## Warnings
Currently, the inter-modules communication serializes the calls results between modules calls with a "data" serialization, so there is no form of typing or prototyping on the received data. So if you typed the result in the called module, you have to re-type it in the calling module; pay attention if in your code you count on tricks like `if (call_result instanceof CustomClass)`.

Also, transports have their own limitations, please see the documentation of the transport you use. The default transport documentation is located in `transport/default/README.md`.
