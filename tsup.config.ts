import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    splitting: false,
    sourcemap: true,
    dts: {
        compilerOptions: {
            moduleResolution: "node",
            allowSyntheticDefaultImports: true,
        },
    },
    clean: true,
    minify: true,
    format: ["cjs", "esm"],
});
