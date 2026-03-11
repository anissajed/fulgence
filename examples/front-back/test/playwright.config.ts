import {PlaywrightTestConfig} from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "tests",
  retries: 1,
  use: {
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {browserName: "chromium"},
    },
  ],
};

export default config;