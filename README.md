# Webservice splitter
In nodejs, provide a lightweight API that allows the same code to run in monolith mode or in distributed mode.

Switching between the 2 modes is made with only a variable, that e.g. may be driven by an environment variable.

The code is highly modulable, to be easily adapted to precise needs.

## Example
`cd ./example`

This example uses http webservers to communicate. The framework can use other protocols, but it's up to you to develop your own server (with Express.js? gRPC? Nest?) and the associated network caller. 

### Monolith mode
Note: the server listens by default on the 3010 port. Ensure the port is accessible - or change it - before running the server.
```
$ node ./index.js
...
Final result { example: true, c: 'c', b: 'b', a: 'a' }
```

### Distributed mode
```
$ docker-compose up
...
task-a  | Final result { example: true, c: 'c', b: 'b', a: 'a' }
```
