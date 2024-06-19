import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import postcss from 'rollup-plugin-postcss';
import dts from "rollup-plugin-dts";

export default [
    {
        input: ["src/index.ts"],
        output: [
          {
            dir: './dist',
            preserveModules: true,
            sourcemap: true
          },
        ],
        plugins: [
            preserveDirectives(),
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "tsconfig.json" }),
            postcss({
              extract: "css/style.css"
            })
        ]
    },
    {
      input: "tailwind.config.ts",
      output: [{file: "dist/tailwind.config.js", format: "esm"}],
      plugins: [
        resolve(),
        commonjs(),
        typescript(),
      ]
    },
    {
      input: "dist/src/index.d.ts",
      output: [{ file: "dist/index.d.ts", format: "esm" }],
      plugins: [dts()],
      external: [/\.css$/]
    },
]