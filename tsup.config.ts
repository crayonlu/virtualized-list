import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	dts: true,
	splitting: true,
	sourcemap: true,
	clean: true,
	minify: false,
	target: ["es2020"],
	outDir: "dist",
	external: ["react", "react-dom"],
	injectStyle: false,
	esbuildOptions: (options) => {
		options.alias = {
			"@": "./src",
		};
	},
});
