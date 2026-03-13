import {describe} from "vitest";
import {testDCFAgainstStrings} from "../../tests/lib/utils.js";

describe("Basic example with auth, distributed mode", testDCFAgainstStrings({
  dcf_dirname: __dirname,
  dcf_basename: "docker-compose.yml",
  service: "a",
  container_name: "task-a",
  searchs: [
    "Sending request with token in header",
    "Final result: { example: true, c: 'c', b: 'b', a: 'a' }",
  ],
}));
