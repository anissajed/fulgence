import {expect, it, beforeAll, afterAll} from "vitest"
import {DockerComposeEnvironment, Wait} from "testcontainers"
import path from "path"

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

  return environment;
}

export const stopDCF = async ({environment}) => {
  if (environment) {
    await environment.down({
      removeVolumes: true,
      timeout: 10_000,
    })
  }
}

export const waitLogContaining = async function (
  container,
  text,
  timeout_ms = 20000
) {
  const stream = await container.logs()

  return new Promise((resolve, reject) => {
    let logs = ""
    let found = false;

    const timeout = setTimeout(() => {
      stream.destroy()
      reject(new Error("Timeout waiting for log"))
    }, timeout_ms)

    stream.on("data", chunk => {
      const line = chunk.toString()
      logs += chunk.toString()
      if (!found && logs.includes(text)) {
        found = true;
        clearTimeout(timeout)
        stream.destroy()
        return resolve(logs);
      }
    })

    stream.on("error", err => {
      clearTimeout(timeout)
      reject(err)
    })
  })
}

export const expectLogFromContainer = async ({
  environment,
  container_name,
  text,
  timeout = 10000,
}) => {
  const container = environment.getContainer(container_name)

  const logs = await waitLogContaining(container, text, timeout);
  expect(logs).toContain(text)
}

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
      })
    }, 60_000)

    afterAll(async () => {
      await stopDCF({environment})
    })


    it("should find the result in logs", async () => {
      await expectLogFromContainer({
        environment,
        container_name,
        text,
      });
    })
  }
}
