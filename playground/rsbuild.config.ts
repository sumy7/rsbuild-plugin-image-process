import { defineConfig } from '@rsbuild/core';
// @ts-ignore
import { pluginImageProcess } from '../dist';

export default defineConfig({
  plugins: [pluginImageProcess()],
  output: {
    dataUriLimit: 0,
  },
});
