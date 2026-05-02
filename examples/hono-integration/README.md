# Hono integration example
This example shows you how how to add Fulgence on top of [Hono](https://hono.dev/).

## Prerequisites
```
npm install
npm run build

# Or, if you prefer using Docker:
docker compose run --rm chunk-a npm install
docker compose run --rm chunk-a npm run build
# Note: you can have the same effect by replacing chunk-a with chunk-b or chunk-c
```

## Run

### Monolith mode
This example uses node on your host machine. If you want to use Docker instead, please create a Docker Compose File from the existing one, with 1 service and no CHUNK_NAME env var set.

```
$ npm start
...

Monolith, Initialization: Listening on port 3010
Run module task-a.js on chunk "undefined"
Run module task-b.js on chunk "undefined"
Run module task-c.js on chunk "undefined"
Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```

### Distributed mode
```
$ docker compose up
...

task-a  | chunk_a, Initialization: Listening on port 3000
task-b  | chunk_b, Initialization: Listening on port 3000
task-c  | chunk_c, Initialization: Listening on port 3000
task-a  | Run module task-a.js on chunk "chunk_a"
task-b  | Run module task-b.js on chunk "chunk_b"
task-c  | Run module task-c.js on chunk "chunk_c"
task-a  | Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```
