import {expect, it, beforeAll, afterAll} from "vitest"
import {DockerComposeEnvironment, Wait} from "testcontainers"

/** @typedef {import("./utils.types").StartDCFAndWaitForLog} StartDCFAndWaitForLog */
/** @type StartDCFAndWaitForLog */
export const startDCFAndWaitForLog = async ({
  dcf_dirname = __dirname,
  dcf_basename = "docker-compose.yml",
  service,
  text,
}) => {
  const environment = await new DockerComposeEnvironment(dcf_dirname, dcf_basename)
    .withWaitStrategy(
      service,
      Wait.forLogMessage(text)
    )
    .up()

  // @ts-ignore
  return environment;
}

/** @typedef {import("./utils.types").StopDCF} StopDCF */
/** @type StopDCF */
export const stopDCF = async ({environment}) => {
  if (environment) {
    // @ts-ignore
    await environment.down({
      removeVolumes: true,
      timeout: 10_000,
    })
  }
}


const onErrorFactory = ({timeout_id, stream, reject}) => (err) => {
  clearTimeout(timeout_id)
  stream.destroy()
  reject(err)
};

/** @typedef {import("./utils.types").WaitLogContaining} WaitLogContaining */
/** @type WaitLogContaining */
export const waitLogContaining = async function (
  container,
  text,
  timeout_ms = 20000
) {
  const stream = await container.logs()

  return new Promise((resolve, reject) => {
    let logs = ""
    let found = false;

    const timeout_id = setTimeout(() => {
      stream.destroy()
      reject(new Error("Timeout waiting for log"))
    }, timeout_ms)

    stream.on("data", (chunk) => {
      logs += chunk.toString()
      if (!found && logs.includes(text)) {
        found = true;
        clearTimeout(timeout_id)
        stream.destroy()
        return resolve(logs);
      }
    })

    stream.on("error", onErrorFactory({timeout_id, stream, reject}))
  })
}

/** @typedef {import("./utils.types").ExpectLogFromContainer} ExpectLogFromContainer */
/** @type ExpectLogFromContainer */
export const expectLogFromContainer = async ({
  environment,
  container_name,
  text,
  timeout = 10000,
}) => {
  // @ts-ignore
  const container = environment.getContainer(container_name)

  const logs = await waitLogContaining(container, text, timeout);
  expect(logs).toContain(text);
}

/** @typedef {import("./utils.types").TestDCFAgainstString} TestDCFAgainstString */
/** @type TestDCFAgainstString */
export const testDCFAgainstString = ({
  dcf_dirname,
  dcf_basename,
  service,
  container_name,
  text,
}) => {
  let environment;

  return () => {
    beforeAll(async () => {
      environment = await startDCFAndWaitForLog({
        dcf_dirname,
        dcf_basename,
        service,
        text,
      });
    }, 60_000)

    afterAll(() => stopDCF({environment}))

    it("should find the result in logs", async () => {
      await expectLogFromContainer({environment, container_name, text});
    })
  }
}
