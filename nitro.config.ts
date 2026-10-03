import { defineConfig } from "nitro";

export default defineConfig({
  errorHandler: "./src/lib/nitro-error-handler.ts",
});
