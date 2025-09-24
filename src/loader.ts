import * as path from 'node:path';
import type { LoaderDefinition } from '@rspack/core';
import {
  ABSOLUTE_URL_REGEX,
  parseProcessImageQuery,
  WINDOWS_PATH_REGEX,
} from './utils.js';
import { worker } from './worker.js';

const processImageLoader: LoaderDefinition = async function (source) {
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

  if (!output.data) {
    return source;
  }

  // @ts-ignore
  if (this._module && !this._module.matchResource) {
    // @ts-ignore
    this._module.matchResource = `${output.filename}${query}`;
  }

  return output.data;
};

export const raw = true;

export default processImageLoader;
