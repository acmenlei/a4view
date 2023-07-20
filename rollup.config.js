import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"

export default [
  {
    input: "./index.ts",
    output: {
      dir: "dist/lib",
      format: "umd",
      name: 'A4View',
      entryFileNames: "a4view.umd.js",
    },
    plugins: [
      typescript(),
      terser()
    ],
  },
  {
    input: "./index.ts",
    output: {
      dir: "dist/lib",
      format: "esm",
      entryFileNames: "a4view.esm.js",
    },
    plugins: [
      typescript(),
      terser()
    ],
  },
]