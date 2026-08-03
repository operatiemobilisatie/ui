import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/components/*.tsx', '!src/components/*.stories.tsx', 'src/lib/*.ts'],
  outDir: 'dist',
  format: ['esm'],
  platform: 'neutral', // no node builtins, no browser shims
  target: 'es2022',

  /*
   * The preserveModules equivalent. Two things depend on it: the per-component
   * subpath exports (./button must be its own file), and shared internals like
   * lib/utils being emitted once instead of inlined into all 28 outputs.
   */
  unbundle: true,
  hash: false,
  sourcemap: true,
  clean: true,
  dts: true,

  /*
   * publint runs here, against the packed tarball, and fails the build.
   *
   * attw deliberately does *not*: it runs as the `attw` npm script, which
   * `build` chains after this. tsdown's `attw` option cannot exclude
   * entrypoints, and three of ours have to be excluded -- attw resolves every
   * export condition as JS/TS, so `./css`, `./fonts` and `./fonts.css`, which
   * point at real stylesheets that load fine in both Vite and Next/Turbopack,
   * come back as "No resolution". Ignoring the `no-resolution` rule wholesale
   * would also hide a genuinely missing JS entrypoint, so the CLI's
   * --exclude-entrypoints is the narrower gate:
   *
   *   attw --pack --profile esm-only --exclude-entrypoints css fonts fonts.css
   */
  publint: true,

  external: [
    /^react($|\/)/,
    /^react-dom($|\/)/,
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'react-select',
    /^@radix-ui\//,
    /^@fortawesome\//,
    'motion',
    /^motion\//,
    'react-countup',
  ],

  /*
   * The stylesheet ships byte-for-byte, Tailwind directives intact, for the
   * consumer's own Tailwind pipeline to process. A plain copy is why this build
   * needs no postcss at all. Same for the woff2 files behind ./fonts.
   */
  copy: [
    // `to` is always the destination *directory*, never the destination path --
    // 'dist/css/style.css' produces a directory of that name, and 'dist/fonts'
    // produces dist/fonts/fonts.
    { from: 'src/css/style.css', to: 'dist/css' },
    { from: 'src/fonts', to: 'dist' },
  ],
});
