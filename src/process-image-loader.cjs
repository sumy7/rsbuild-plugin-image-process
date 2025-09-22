const path = require('node:path');
const sharp = require('sharp');

const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\/;
const POSIX_PATH_REGEX = /^\//;

/**
 * @param {string} url URL
 * @returns {boolean} true when URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  return (
    WINDOWS_PATH_REGEX.test(url) ||
    POSIX_PATH_REGEX.test(url) ||
    ABSOLUTE_URL_REGEX.test(url)
  );
}

/**
 * Rspack Loader: 处理带有 ?process-image=xxx 的图片资源，打印宽高
 */

async function processImageLoader(source) {
  const resourceQuery = this.resourceQuery || '';
  if (!resourceQuery.includes('process-image')) {
    return source;
  }
  const filePath = this.resourcePath;
  const query = this.resourceQuery;

  let filename =
    ABSOLUTE_URL_REGEX.test(this.resourcePath) &&
    !WINDOWS_PATH_REGEX.test(this.resourcePath)
      ? this.resourcePath
      : path.relative(this.rootContext, this.resourcePath);
  // 修改扩展名为 .webp
  filename = Date.now() + filename.replace(/\.[^.]+$/, '.webp');

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;
    console.log(
      `图片: ${path.basename(filePath)} 原始宽: ${width}, 原始高: ${height}`,
    );
    if (width && height) {
      const newWidth = Math.round(width * 0.5);
      const newHeight = Math.round(height * 0.5);
      const resizedBuffer = await image
        .resize(newWidth, newHeight)
        .toFormat('webp')
        .toBuffer();
      console.log(
        `图片: ${path.basename(filePath)} 缩放后宽: ${newWidth}, 缩放后高: ${newHeight}，已转为 webp 格式`,
      );

      // 修改输出文件名后缀为 .webp
      if (this.emitFile && this._module && this._module.buildInfo) {
        // Rspack/webpack loader context
        const info = this._module.buildInfo;
        console.log('修改输出文件名为 .webp:', this._module);
        if (this._module && !this._module.matchResource) {
          this._module.matchResource = `${filename}${query}`;
          console.log('修改输出文件名为 .webp:', this._module.matchResource);
        }
      }
      return resizedBuffer;
    }
  } catch (err) {
    console.error('处理图片失败:', filePath, err);
  }
  return source;
}

processImageLoader.raw = true;
module.exports = processImageLoader;
