import {describe} from "vitest";
import {testDCFAgainstStrings} from "../../tests/lib/utils";

describe("Basic example with auth, distributed mode", testDCFAgainstStrings({
  dcf_dirname: __dirname,
  dcf_basename: "docker-compose.yml",
  service: "a",
  container_name: "task-a",
  searchs: [
    "Loaded YAML config file",
    "Final result: { example: true, c: 'c', b: 'b', a: 'a' }",
  ],
}));
