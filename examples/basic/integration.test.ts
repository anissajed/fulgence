import {describe} from "vitest"
import {testDCFAgainstString} from "../../tests/lib/utils"

describe("Basic example distributed mode", testDCFAgainstString({
  dcf_dirname: __dirname,
  dcf_basename: "docker-compose.yml",
  service: "a",
  container_name: "task-a",
  text: "Final result: { example: true, c: 'c', b: 'b', a: 'a' }",
}))
