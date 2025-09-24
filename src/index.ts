import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RsbuildPlugin } from '@rsbuild/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type PluginImageProcessOptions = {};

export const pluginExample = (
  options: PluginImageProcessOptions = {},
): RsbuildPlugin => ({
  name: 'plugin-image-process',

  setup(api) {
    // 注入自定义 loader 到 Rsbuild
    api.modifyBundlerChain((chain, { CHAIN_ID, isServer }) => {
      chain.module
        .rule('process-image')
        .test(/\.(png|jpe?g|webp)$/i)
        .resourceQuery(/process-image/)
        .use('process-image-loader')
        .loader(resolve(__dirname, './loader.mjs'));
    });
  },
});
