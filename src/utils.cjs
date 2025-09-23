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
 * 解析图片处理查询字符串，返回操作数组
 * 例如 query = "resize,w_200,h_200/format,webp"
 *
 * @param {string} query
 * @returns {Array<{ operation: string, params: string[] }>}
 */
function parseProcessImageQuery(query) {
  return query.split('/').map((opStr) => {
    const [operation, ...params] = opStr.split(',');
    return { operation, params };
  });
}

/**
 * 解析操作参数, 例如 ["w_200", "h_200"] => { w: 200, h: 200 }
 * @param {Array<string>} params
 */
function parseParams(params) {
  return params.reduce((acc, param) => {
    const [key, value] = param.split('_');
    acc[key] = value || true;
    return acc;
  }, {});
}

/**
 * 规范化数值范围
 * @param {string|number} value
 * @param {number} min
 * @param {number} max
 * @param {number} defaultValue
 * @returns
 */
function numberInRange(value, min, max, defaultValue) {
  const num = parseInt(value, 10);
  if (Number.isNaN(num)) {
    return defaultValue;
  }
  return Math.min(max, Math.max(min, num));
}

/**
 * 规范化选项，确保值在选项列表中
 * @param {string} value
 * @param {Array<string>} options
 * @param {string} defaultValue
 * @returns
 */
function valueInList(value, options, defaultValue) {
  if (options.includes(value)) {
    return value;
  }
  return defaultValue;
}

module.exports = {
  ABSOLUTE_URL_REGEX,
  WINDOWS_PATH_REGEX,
  POSIX_PATH_REGEX,
  isAbsoluteURL,
  parseProcessImageQuery,
  parseParams,
  numberInRange,
  valueInList,
};
