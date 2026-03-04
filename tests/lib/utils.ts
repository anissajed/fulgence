import { expect, it, beforeAll, afterAll } from "vitest"
import { DockerComposeEnvironment, Wait, StartedTestContainer } from "testcontainers"
import path from "path"

const startDCFAndWaitForLog = async ({
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

const stopDCF = async ({environment}) => {
  if (environment) {
    await environment.down({
      removeVolumes: true,
      timeout: 10_000,
    })
  }
}

const waitLogContaining = async function (
  container: StartedTestContainer,
  text: string,
  timeout_ms = 10000
) {
  const stream = await container.logs({ follow: true })

  return new Promise<void>((resolve, reject) => {
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

const expectLogFromContainer = async ({
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
  let environment: DockerComposeEnvironment

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
        container_name: "task-a",
        text,
      });
    })
  }
}
