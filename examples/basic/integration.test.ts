import {describe} from "vitest";
import {testDCFAgainstStrings} from "../../tests/lib/utils.js";

describe("Basic example, distributed mode", testDCFAgainstStrings({
  dcf_dirname: __dirname,
  dcf_basename: "docker-compose.yml",
  service: "a",
  container_name: "task-a",
  searchs: [
    "Final result: { example: true, c: 'c', b: 'b', a: 'a' }",
  ],
}));
