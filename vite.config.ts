import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const alias = { "@": path.resolve(__dirname, "src") };

export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      plugins: [react()],
      resolve: { alias },
      build: {
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          formats: ["es"],
          fileName: "noora-datepicker",
          cssFileName: "styles",
        },
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
        cssCodeSplit: false,
        rollupOptions: {
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "react/jsx-dev-runtime",
            "antd",
            /^antd\//,
          ],
        },
      },
    };
  }

  return {
    base: "./",
    plugins: [react(), tailwindcss(), viteSingleFile()],
    resolve: { alias },
    server: {
      watch: {
        ignored: ["**/dist/**", "**/demo-dist/**"],
      },
    },
    build: {
      outDir: "demo-dist",
    },
  };
});
