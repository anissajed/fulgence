# Fulgence
Run the same Node.js modules either as a single process or as distributed services — without rewriting your business code.

Fulgence decouples **module boundaries** from **deployment boundaries**, allowing you to switch execution modes at runtime while keeping your codebase unchanged.

Ideal for teams migrating from monolith to microservices — or who want to keep both options open.

## Features
- Run modules as monolith or distributed services
- Runtime execution mode switching
- Transport-agnostic core
- Plugin-based extensibility
- Progressive monolith-to-microservices migration

## Installation
```
npm install fulgence
```

## Quick Start
The example below demonstrates how the same entrypoint can run either as a monolith or as distributed services depending on environment variables.

```js
import entrypoint from "fulgence";

const name = process.env.CHUNK_NAME;
const {api} = await entrypoint({
  name, // undefined => monolith mode
  config_path: new URL("./api-config.json", import.meta.url).pathname, // fulgence config file
  port: process.env.PORT,
});

// Trigger the initial call from a single module
if (!name || name == "a") {
  const result = await api.a({"arg": "initial argument"});
  console.log("Result:", result);
}
```

Distributed mode:
```bash
$ PORT=3000 CHUNK_NAME=b node ./index.js &
$ PORT=3001 CHUNK_NAME=a node ./index.js &
```

Monolith mode:
```bash
$ PORT=3002 node ./index.js &
```

See the `examples/` directory for complete working setups.

## How it works
Fulgence introduces a thin execution layer around your modules.

At runtime, each module can either:

- Execute locally (monolith mode), or
- Be exposed as a service and invoked remotely (distributed mode).

The selection is controlled dynamically (for example, through environment variables).

The core is transport-agnostic and can be extended via plugins, allowing custom communication strategies and execution lifecycles.

## Why Fulgence?

Modern architectures evolve. Teams often start with a monolith and later adopt microservices — or need both depending on the environment.

Fulgence lets you:

### Develop microservices without local overhead
Running multiple services locally increases memory usage, startup time, and operational complexity.

With Fulgence, you can develop everything as a single process while keeping true service boundaries in production.

### Migrate progressively from monolith to services
Extracting services from a monolith usually requires rewriting communication layers.

Fulgence introduces service boundaries without forcing you to rewrite business modules.

### Keep architectural flexibility
Executable boundaries are configurable at runtime.

Your code structure stays stable while your deployment model evolves.

## API
Please refer to `docs/api.md` .

## tests
The integration tests use Docker Compose (more precisely the docker compose files from the examples), check you installed Docker before running the tests.

To run the tests: `npm run test`

npx vitest
## Contributing
TODO

## Warnings and limitations
### Transport serialization
The default transport serializes call results as plain data.
Type information and prototypes are not preserved across module boundaries.

If your code relies on constructs such as:

```js
instanceof CustomClass
```

you must handle reconstruction manually.

Refer to the transport documentation for more details. The default transport documentation is located in `transport/default/README.md`.

### Roadmap considerations
Some features are still evolving.

For example, a task-dedicated shell syntax in the config file may be introduced in future versions.

Managing service-specific dependencies is also under consideration.
Currently, maintaining one `package.json` per service is recommended.

## About the name
Fulgence Bienvenüe directed the development of the Paris Metro, combining centralized planning and shared standards with independently operating lines. This package adopts his (first) name to reflect the same principle: a system that can run as a single unit or as coordinated services.
