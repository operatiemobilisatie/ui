import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: { disableTelemetry: true },
  typescript: { reactDocgen: 'react-docgen-typescript' },
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [tailwindcss()],
      // Deterministic output for visual regression: never let an asset be inlined
      // in one build and emitted as a file in the next.
      build: { assetsInlineLimit: 0 },
    }),
};

export default config;
