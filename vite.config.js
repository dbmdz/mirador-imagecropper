import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

const buildMode = process.env.BUILD_MODE ?? "plugin";

const pluginConfig = {
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        /^@emotion\/(react|styled)/,
        /^@mui\/(material|system)/,
        "mirador",
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom",
        "react-i18next",
      ],
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  // FIXME: remove this as soon https://github.com/react-grid-layout/react-draggable/issues/806 is fixed
  // react-draggable is bundled into the published library via react-rnd, and
  // reads process.env.DRAGGABLE_DEBUG during drag start. Vite lib builds leave
  // that reference intact, which crashes in webpack 5/browser consumers without
  // a `process` global. Replace the debug flag at build time.
  define: {
    "process.env.DRAGGABLE_DEBUG": "false",
  },
  plugins: [react()],
  server: {
    open: true,
  },
};

const demoConfig = {
  build: {
    outDir: resolve(__dirname, "demo/dist"),
    rollupOptions: {
      input: {
        demo: resolve(__dirname, "index.html"),
      },
    },
  },
  plugins: [react()],
  server: {
    open: true,
  },
};

export default defineConfig(buildMode !== "demo" ? pluginConfig : demoConfig);
