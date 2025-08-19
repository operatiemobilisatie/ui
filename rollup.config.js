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
            dir: "dist",
            preserveModules: true,
            preserveModulesRoot: "./src",
            sourcemap: true
          },
        ],
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }
          warn(warning);
        },
        external: (id) => id === "tslib" || id.includes("node_modules"),
        plugins: [
            preserveDirectives(),
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "tsconfig.json" }),
            postcss({
              config: false,
              extract: "css/style.css",
            })
        ],
    },
    {
      input: "dist/index.d.ts",
      output: [
        {
          file: "dist/index.d.ts",
          format: "esm",
        }
      ],
      plugins: [dts()],
      external: [/\.css$/]
    },
]