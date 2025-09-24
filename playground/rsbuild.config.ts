import { defineConfig } from '@rsbuild/core';
// @ts-ignore
import { pluginExample } from '../dist';

export default defineConfig({
  plugins: [pluginExample()],
  output: {
    dataUriLimit: 0,
  },
});
