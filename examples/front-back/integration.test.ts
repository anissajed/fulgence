import {describe} from "vitest";
import {testDCFAgainstStrings} from "../../tests/lib/utils";

describe("Frontend example, distributed mode", testDCFAgainstStrings({
  dcf_dirname: __dirname,
  dcf_basename: "docker-compose.yml",
  service: "test",
  container_name: "test",
  searchs: [
    'Final result: {"example":true,"a":"a"}',
  ],
}));
