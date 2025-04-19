import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      include: ["**/*.jsx", "**/*.js"],
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-redux",
      "redux",
      "redux-persist",
      "redux-saga",
      "@reduxjs/toolkit",
      "redux-actions",
      "redux-logger",
      "redux-modal",
      "reselect",
    ],
    esbuildOptions: {
      target: "es2020",
    },
  },
});
