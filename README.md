# Flugence
In Node.js, provide a lightweight yet powerful API that allows the same code to run in a monolith or in distributed chunks in different services.

Switching between the 2 modes is straightforward, e.g. you may drive it with an environment variable.

The code is highly modular and can be enhanced with plugins, to be easily adapted to various and precise needs.

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
      "url": "http://localhost:3000"
    },
  }
}

// index.js
const name = process.env.CHUNK_NAME;
const {api} = await entrypoint({
  name,
  config_path: new URL("./api-config.json", import.meta.url).pathname,
  port: process.env.PORT,
});
if (!name || name == "a") {
  const result = await api.a({"arg": "initial argument"});
  console.log("Result:", result);
}

// shell, distributed mode
$ PORT=3000 CHUNK_NAME=b node ./index.js &
$ PORT=3001 CHUNK_NAME=a node ./index.js &

// shell, monolith mode
$ PORT=3002 node ./index.js &
```

For full working examples, please see the `examples` folder.

## Motivations
Nowadays SOA is an architectural choice for many projects; however monoliths still have a strong place, due to their simplicity. Some kind of compromises appear, such as distributed monoliths, but they have failed to appear as a consensual solution. This module aims to easily switch between SOA and monolith - in terms of "true services"/executables - to allow getting the best of each world, depending on the situation.

One use case is when you (as a developer) migrated your backend monolith to (micro?)services and are happy with the benefits; but as the number of your services grows, the memory footprint of your app does the same. This is not an issue in your deployment environment, but your development machine is different (for those who have not exported their development to the cloud). When you check the causes, you see that your local Kubernetes/Docker-compose/whatever container orchestration solution does its job well with lightweight containers. However, the multiplication of your containers also multiplies your Node.js executables (~50MB footprint?) and the dependencies loaded in total (typically between 50MB and 500MB per service, depending on your project and your dev tools).

For an e.g. 8-microservices app - a medium-sized mature app IMHO - with an average 150MB/service dependencies memory footprint, we may have a difference of 1.4GB. For some this is not an issue (pro developers may have 32GB machines), but for others it can be an issue: in the time to start the whole app, to limit the costs of your cloud dev environment, etc.

Another situation is the monolith -> SOA migration itself: there is a development cost on the modules inter-connection feature, that can be reduced or avoided simply by using this package from the start of the migration.

Once the main goal of this framework was clear, I wanted it to be lean and unopinionated. It is a 0-dependencies package that is compatible with the main JS coding styles, a priori all popular transport technologies (RESTful calls, RPC, events, etc.), popular architectures (DDD, SOA, EDA, etc.) and the common backend features and technologies (e.g. authentication), thanks to the plugins systems.

### Good practices
Another advantage is: "Defer the actual decision until a decision can be made more responsibly, based on actual knowledge, but not so late that it is not possible to take advantage of that knowledge." This package aims to defer which code is run on which executable/service/container, the "executable boundaries" within your project. Note these are not the "module boundaries" you can have in a Dependency Injection framework such as NestJS, thus you can e.g. run together Flugence and NestJS without bad interference.

### About the name
Fulgence Bienvenüe directed the development of the Paris Metro, combining centralized planning and shared standards with independently operating lines. This framework adopts his (first) name to reflect the same principle: a system that can run as a single unit or as coordinated services.

## Warnings and limitations
### Transport-specific limitations
Currently, the inter-modules communication of the default transport serializes the call results between module calls with a "data" serialization, so there is no form of typing or prototyping on the received data. So if you typed the result in the called module, you have to re-type it in the calling module; pay attention if in your code you rely on things like `if (call_result instanceof CustomClass)`.

Also, transports have their own limitations, please see the documentation of the transport you use. The default transport documentation is located in `transport/default/README.md`.

### Youthful flaws
At the time of writing (Feb. 26) this package is still "young", and may be improved in the future with strategic features.

One candidate is a task-dedicated shell: as of now it is easily possible by writing your own transport shell and passing options to the entry point, but this is not strongly and explicitly supported by the package itself.

An issue still in mind is to find a graceful way to avoid multiplying the service-specific dependencies. The best solution as of now is to maintain one `package.json` per service — as (indirectly) advised by microservice good practices.

## API

### entrypoint
`entrypoint()` accepts hooks, to customise the way a task is initialized and called. Thus, you can choose to write a task in functional or object-oriented style, add global error handling, etc.

```
import entrypoint from "fulgence";
const {
  server,
  api, // returns a client to call the tasks. More details in "client api".
} = await entrypoint({
  name, // module name (e.g. "a"), let undefined for monolith mode
  config_path, // the path of the config file, e.g. "/home/me/my-project/config.json"
  port, // the port where you want this chunk (or monolith) to listen, e.g. 80
  <arbitrary args>
});
```

Returned `server` object is your task(s)/chunk(s) server. It is returned essentially to allow you to hack it if you need to. It depends on the transport you choose in your config file.

`<arbitrary args>` are transport-specific values to customize the server/shell; cf the documentation of your transport for more details.

### buildApi
`buildApi` is primarily used when you run the client on an executable where entrypoint() is not
called.

```
import {buildApi} from "fulgence";
const api = await buildApi({
  local_module_name, // module name (e.g. "a"), let undefined for monolith mode
  config_path, // the path of the config file, e.g. "/home/me/my-project/api-config.json"
});
```
More details on the returned `api` object in `client api` section.

### client api
It can call every module declared in the config file. If the module is a local one, it's a direct call; else it's a remote call. The way it is done is as transparent as possible for the caller.

It is the API passed to each module to allow them to call other modules - and it is the same interface for chunks and monolith. It can be invoked "standalone" with `buildApi`. It is also returned by `entrypoint()`.

```
// Call task/chunk "b" with some input arg:
const res = await api.c(input);
```

The shape of the api can be modified with the tasks lifecycle plugin, as shown in `examples/object-oriented-tasks`.

### config file
TODO

Currently, the config file can only be a JSON file.

### transport
TODO

### tasks lifecycle plugin
This plugin must export `onInitTask` and `onDoTask`. Those two hooks are used in conjunction to customize the way a task is created and executed.

`onInitTask` default: `async ({module, api}) => module.default`
`onDoTask` default: `async ({task, input, api}) => task(input, api)`

`onInitTask` runs just after the JS module containing the task is imported. It returns the initialized task (ready to be executed), and this task can have any type. The returned task is passed later to `onDoTask`.

`onDoTask` is the way the task is executed. The returned value will be passed to the caller - modulo the potential transports middlewares.

A custom tasks lifecycle plugin can be found in `examples/object-oriented-tasks`.

The plugin is set in the config file, see the "config file" section for more details.
