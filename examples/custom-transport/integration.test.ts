import {describe} from "vitest";
import {testDCFAgainstStrings} from "../../tests/lib/utils"

describe("Custom transport example, distributed mode", testDCFAgainstStrings({
  dcf_dirname: __dirname,
  dcf_basename: "docker-compose.yml",
  service: "a",
  container_name: "task-a",
  searchs: [
    "Will request Jayson server",
    "Final result: { example: true, c: 'c', b: 'b', a: 'a' }",
  ],
}));
