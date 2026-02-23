# Webservice splitter
In nodejs, provide a lightweight API that allows the same code to run in monolith mode or in distributed mode.

Switching between the 2 modes is made with only a variable, that e.g. may be driven by an environment variable.

The code is highly modulable, to be easily adapted to precise needs.

## Examples
Please see `examples` folder.

## Warnings
Currently, the inter-modules communication serializes the calls results between modules calls with a "data" serialization, so there is no form of typing or prototyping on the received data. So if you typed the result in the called module, you have to re-type it in the calling module; pay attention if in your code you count on tricks like `if (call_result instanceof CustomClass)`.
