import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"], // 移除了 iife，保留主流的 esm 和 cjs
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: ["es2020"],
  outDir: "dist",
  external: ["react", "react-dom"],
  injectStyle: false,
});
