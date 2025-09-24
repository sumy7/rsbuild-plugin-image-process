import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      id: 'esm_index',
      format: 'esm',
      syntax: 'es2022',
      dts: true,
    },
    {
      id: 'esm_loader',
      format: 'esm',
      syntax: 'es2022',
      dts: true,
      source: {
        entry: {
          loader: 'src/loader.ts',
        },
      },
      output: {
        filename: {
          js: '[name].mjs',
        },
      },
    },
    {
      id: 'cjs_index',
      format: 'cjs',
      syntax: 'es2022',
      source: {
        entry: {
          index: './src/index.ts',
        },
      },
    },
  ],
});
