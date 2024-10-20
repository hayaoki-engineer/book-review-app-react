// playwright.config.js
import { devices } from "@playwright/test";

export default {
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  workers: process.env.CI ? 2 : undefined,
  outputDir: "test-results/",
  testIgnore: ['**/setupTests.ts'],
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
  timeout: 60000,
};
