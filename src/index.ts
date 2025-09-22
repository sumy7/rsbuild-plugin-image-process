import { dirname, join } from 'node:path';
import type { RsbuildPlugin } from '@rsbuild/core';

export type PluginExampleOptions = {
  foo?: string;
  bar?: boolean;
};

export const pluginExample = (
  options: PluginExampleOptions = {},
): RsbuildPlugin => ({
  name: 'plugin-image-process',

  setup(api) {
    // 注入自定义 loader 到 Rsbuild
    api.modifyBundlerChain((chain, { CHAIN_ID, isServer }) => {
      chain.module
        .rule('process-image')
        .test(/\.(png|jpe?g|gif|webp)$/i)
        .resourceQuery(/process-image/)
        .use('process-image-loader')
        .loader(join(__dirname, './process-image-loader.cjs'));
    });
  },
});
