import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    exclude: ["playwright-tests/**", "node_modules"], // Playwrightのテストを除外
    include: ["src/**/*.test.ts", "src/**/*.spec.ts", "src/**/*.test.tsx"],
  },
});
