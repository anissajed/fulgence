# Frontend use Example
This example shows you how to call the tasks from a browser.

## Prerequisites
The Docker Compose way is the preferred one. Please ensure you have Docker installed.

## Run

### Monolith mode
Since there is only one task in this example, the monolith and distributed modes are similar here. Please refer to distributed mode.

### Distributed mode
```
$ docker compose up
...
front  |   VITE v7.3.1  ready in 319 ms
front  | 
front  |   ➜  Local:   http://localhost:3100/
# When you see the previous line, you can trigger a task call
# by accessing this URL with your browser. The call is triggrered by the client JS.
Next in logs, a test container will validate this behaviour.
...
back   | Run module a on chunk "a"
test   | Found in HTML:
test   | Final result: {"example":true,"a":"a"}
test   |   ✓  1 [chromium] › tests/main.spec.ts:7:3 › main › requires task result (20.4s)
test   | 
test   |   1 passed (22.9s)
test exited with code 0
```
