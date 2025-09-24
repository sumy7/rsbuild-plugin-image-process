import sharp from 'sharp';
import { numberInRange, parseParams, valueInList } from './utils.js';

type StepContext = {
  image: sharp.Sharp;
  metadata: sharp.Metadata;
  operations: { operation: string; params: string[] }[];
  stepParams: string[];
  format: string;
  filename: string;
  quality: number;
  data: Buffer | null;
};

/**
 * 处理 format 操作，参数 value，支持 jpeg,png,webp，不支持的格式则使用 webp
 */
const formatStep = async (context: StepContext) => {
  const operation = context.operations.find((op) => op.operation === 'format');
  const params = parseParams(operation ? operation.params : []);
  const format = valueInList(
    Array.from(Object.keys(params))[0],
    ['jpeg', 'png', 'webp'],
    context.format,
  );

  switch (format) {
    case 'jpeg':
      context.image = context.image.jpeg({ quality: context.quality });
      break;
    case 'png':
      context.image = context.image.png({ quality: context.quality });
      break;
    case 'webp':
      context.image = context.image.webp({ quality: context.quality });
      break;
    default:
      context.image = context.image.webp({ quality: context.quality });
      break;
  }
  context.format = format;
  context.stepParams.push(`format-${format}`);
};

/**
 * 处理 quality 操作，参数 q_value|Q_value，范围 1-100，默认 100
 */
const qualityStep = async (context: StepContext) => {
  const operation = context.operations.find((op) => op.operation === 'quality');
  const params = parseParams(operation ? operation.params : []);

  const quality = numberInRange(
    parseInt(params.q || params.Q || '100', 10),
    1,
    100,
    100,
  );
  context.stepParams.push(`quality-q_${quality}`);
  context.quality = quality;
};

/**
 * 处理 resize 操作，参数 w_value,h_value，范围 1-10000
 */
const resizeStep = async (context: StepContext) => {
  const operation = context.operations.find((op) => op.operation === 'resize');
  const params = parseParams(operation ? operation.params : []);

  // 等比例缩放，p 参数为百分比 [1,1000]
  if (params.p) {
    const percent = numberInRange(parseInt(params.p, 10), 1, 1000, 100);
    const { width, height } = context.metadata;
    if (width && height) {
      const newWidth = Math.round((width * percent) / 100);
      const newHeight = Math.round((height * percent) / 100);
      context.image = context.image.resize(newWidth, newHeight);
      context.stepParams.push(`resize-p_${percent}`);
    }
  } else {
    // 指定宽高缩放
    const w = params.w
      ? numberInRange(parseInt(params.w, 10), 1, 16384, null)
      : null;
    const h = params.h
      ? numberInRange(parseInt(params.h, 10), 1, 16384, null)
      : null;
    const l = params.l
      ? numberInRange(parseInt(params.l, 10), 1, 16384, null)
      : null;
    const s = params.s
      ? numberInRange(parseInt(params.s, 10), 1, 16384, null)
      : null;
    const m = params.m || 'lfit';
    const limit = params.limit !== undefined ? parseInt(params.limit, 10) : 1;
    const color = params.color || 'FFFFFF';
    const { width: origW, height: origH } = context.metadata;

    // limit=1 且目标尺寸大于原图时，返回原图尺寸
    let targetW = w,
      targetH = h;
    if (!targetW && !targetH && l) {
      // 按最长边
      if (origW >= origH) {
        targetW = l;
      } else {
        targetH = l;
      }
    } else if (!targetW && !targetH && s) {
      // 按最短边
      if (origW <= origH) {
        targetW = s;
      } else {
        targetH = s;
      }
    }

    // limit=1 且目标尺寸大于原图时，返回原图
    if (limit === 1) {
      if ((targetW && targetW > origW) || (targetH && targetH > origH)) {
        targetW = origW;
        targetH = origH;
      }
    }

    // sharp fit模式映射
    let fit = 'inside';
    switch (m) {
      case 'lfit':
        fit = 'inside';
        break;
      case 'mfit':
        fit = 'outside';
        break;
      case 'fill':
        fit = 'cover';
        break;
      case 'pad':
        fit = 'contain';
        break;
      case 'fixed':
        fit = 'fill';
        break;
      default:
        fit = 'inside';
    }

    // pad 模式下处理背景色
    const resizeOpts = { fit, background: '#FFFFFF' };
    if (fit === 'contain') {
      resizeOpts.background = `#${color}`;
    }

    if (targetW || targetH) {
      context.image = context.image.resize(targetW, targetH, resizeOpts as any);
      let paramStr = `resize-w_${targetW || ''},h_${targetH || ''},m_${m}`;
      if (l) paramStr += `,l_${l}`;
      if (s) paramStr += `,s_${s}`;
      if (params.limit !== undefined) paramStr += `,limit_${limit}`;
      if (fit === 'contain') paramStr += `,color_${color}`;
      context.stepParams.push(paramStr);
    }
  }
};

export async function worker(
  input: string,
  filename: string,
  operations: { operation: string; params: string[] }[],
) {
  const context = {
    // sharp 实例
    image: null,
    // 图片元信息
    metadata: null,
    // 解析的操作数组
    operations,
    // 每一步操作的参数，最终会拼接到图片名称中
    stepParams: [],
    // 图片格式，jpeg,png,webp
    format: null,
    // 图片名称，包含操作参数和最终
    filename: filename,
    // 图片质量，1-100
    quality: 100,
    // 最终输出的图片数据
    data: null,
  } as unknown as StepContext;

  try {
    const image = sharp(input);
    const metadata = await image.metadata();
    context.format = metadata.format || 'webp';
    context.image = image;
    context.metadata = metadata;

    await Promise.all(
      [resizeStep, qualityStep, formatStep].map(async (step) => {
        await step(context);
      }),
    );

    context.data = await context.image.toBuffer();

    // 生成新的文件名
    const ext = context.format;
    const baseName = filename.replace(/\.[^/.]+$/, '');
    const paramStr = context.stepParams.join('_');
    context.filename = paramStr
      ? `${baseName}_${paramStr}.${ext}`
      : `${baseName}.${ext}`;
  } catch (err) {
    console.error('处理图片失败:', filename, err);
  }
  return context;
}
