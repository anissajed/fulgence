# Object-oriented tasks example
This example shows you how to change the wrinting style of your tasks.

## Prerequisites
Install Fulgence, as described in the package README.

Then, do `npm install` in this directory to link the package.

## Run

### Monolith mode
Note: the server listens by default on the 3010 port. Ensure the port is accessible - or change it with the PORT env var - before running the server.
```
$ node ./index.js
...
Run ModuleA.addAttributes() on chunk "undefined"
Run ModuleB.addBCAttributes() on chunk "undefined"
Run ModuleC.addCAttribute() on chunk "undefined"
Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```

### Distributed mode
```
$ docker compose up
...
task-a  | Run ModuleA.addAttributes() on chunk "a"
task-b  | Run ModuleB.addBCAttributes() on chunk "b"
task-c  | Run ModuleC.addCAttribute() on chunk "c"
task-a  | Final result: { example: true, c: 'c', b: 'b', a: 'a' }
```
