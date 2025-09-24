# rsbuild-plugin-image-process

<p>
  <a href="https://npmjs.com/package/rsbuild-plugin-image-process">
   <img src="https://img.shields.io/npm/v/rsbuild-plugin-image-process?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/rsbuild-plugin-image-process?minimal=true"><img src="https://img.shields.io/npm/dm/rsbuild-plugin-image-process.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

A plugin for [Rsbuild](https://rsbuild.dev/) based on [sharp](https://github.com/lovell/sharp), supporting image resizing, format conversion, quality adjustment, and more.

## Usage

Install:

```bash
npm add rsbuild-plugin-image-process -D
```

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts
import { pluginImageProcess } from "rsbuild-plugin-image-process";

export default {
  plugins: [pluginImageProcess()],
};
```

### Importing Images with Processing Parameters

You can pass processing parameters directly in the import statement:

```js
import Image from './example.png?image-process=resize,w_100,h_100';
```

The query string after `?image-process=` defines the processing steps and parameters.

## Supported Operations & Parameters

### resize

- **Proportional resize**:
  - `p`: Scale by percentage, [1,1000]. Less than 100 means shrink, greater than 100 means enlarge.
  - Example: `resize,p_50` (shrink to 50% of original)

- **Resize by width/height**:
  - `w`: Target width [1,16384]
  - `h`: Target height [1,16384]
  - `m`: Resize mode
    - `lfit` (default): Proportional fit within target box
    - `mfit`: Proportional cover target box
    - `fill`: Proportional cover and center crop
    - `pad`: Proportional fit and pad with color
    - `fixed`: Force resize to exact width and height
  - `l`: Longest side [1,16384]
  - `s`: Shortest side [1,16384]
  - `limit`: If 1 (default), do not enlarge beyond original size; if 0, allow upscaling
  - `color`: Padding color for `pad` mode (RGB hex, e.g. FFFFFF)
  - Example: `resize,w_300,h_200,m_pad,color_000000`

### format

- `format`: Output format, supports `jpeg`, `png`, `webp`. Unsupported formats default to webp.
- Example: `format,webp`

### quality

- `q` or `Q`: Image quality, 1-100, default 100.
- Example: `quality,q_80`

## Query Example

You can chain multiple operations:

```
image-process=resize,w_200,h_200/format,webp/quality,q_80
```


## License

[MIT](./LICENSE).
