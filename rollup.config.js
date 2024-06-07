import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import preserveDirectives from 'rollup-plugin-preserve-directives';

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
            typescript({ tsconfig: "tsconfig.json" })
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
    }
]