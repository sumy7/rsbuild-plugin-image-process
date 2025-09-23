const path = require('node:path');
const { worker } = require('./worker.cjs');
const {
  ABSOLUTE_URL_REGEX,
  WINDOWS_PATH_REGEX,
  parseProcessImageQuery,
} = require('./utils.cjs');

async function processImageLoader(source) {
  const parsedQuery =
    this.resourceQuery.length > 0
      ? new URLSearchParams(this.resourceQuery)
      : null;

  // 如果没有 process-image 查询参数，则直接返回原始资源
  if (!parsedQuery || !parsedQuery.has('process-image')) {
    return source;
  }

  const operationStr = parsedQuery.get('process-image') || '';
  const operations = parseProcessImageQuery(operationStr);

  const filePath = this.resourcePath;

  const filename =
    ABSOLUTE_URL_REGEX.test(this.resourcePath) &&
    !WINDOWS_PATH_REGEX.test(this.resourcePath)
      ? this.resourcePath
      : path.relative(this.rootContext, this.resourcePath);

  const output = await worker(filePath, filename, operations);

  let query = this.resourceQuery;

  if (parsedQuery) {
    parsedQuery.delete('process-image');

    query = parsedQuery.toString();
    query = query.length > 0 ? `?${query}` : '';
  }

  if (this._module && !this._module.matchResource) {
    this._module.matchResource = `${output.filename}${query}`;
  }

  return output.data;
}

processImageLoader.raw = true;
module.exports = processImageLoader;
