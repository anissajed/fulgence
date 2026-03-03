
# Basic Example
This example demonstrates the simplest way to split tasks into separate modules and unify them under a single API.

It is built around three tasks/modules:
- `a.js`
- `nested/b.js`
- `nested/c.js`

---

## What This Example Shows
- How to declare your tasks/modules in the configuration file
- How tasks call each other transparently via the `api`
- How the same code runs in **monolith mode** and **distributed mode**
- How the default transport behaves in both scenarios

---

## Prerequisites
1. **Docker** must be installed (used for distributed mode).
2. Install project dependencies from the repository root:
```bash
cd ../..
npm install
```

3. Then return to this example directory before running it.

---

## Running the Example
### Monolith Mode
In monolith mode, all modules run within a single process.

> The server listens on port `3010` by default.
> Ensure the port is available, or override it using the `PORT` environment variable.

```bash
node ./index.js
```

Expected output:
```
Run module a on chunk "undefined"
Run module b on chunk "undefined"
Run module c on chunk "undefined"
Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```

#### Troubleshooting
Ensure `CHUNK_NAME` is empty:
```bash
CHUNK_NAME="" node ./index.js
```

---

### Distributed Mode
In distributed mode, each module runs in its own container and communicates over HTTP using the default transport.

```bash
docker-compose up
```

Expected output:
```
task-a  | Run module a on chunk "a"
task-b  | Run module b on chunk "b"
task-c  | Run module c on chunk "c"
task-a  | Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```

This demonstrates that:
- Each module runs independently
- Calls between modules are performed over HTTP
- The caller code remains identical to monolith mode

---

## Notes
This example is intended as a minimal proof of concept.

It does **not** include:
- Authentication
- Authorization
- Production-grade transport features

For an example including authentication with the default transport, see the `basic-with-auth` example.
