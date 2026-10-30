/**
 * 文本清洗（Normalization & Noise Removal）
 * 所有 loader 读取到原始文本后，先经过这里统一清洗，再交给切片器。
 * 目标：去掉页眉页脚、脚本标签、多余空白与编码噪声，保留标题层级与正文语义。
 */

/** 清洗开关，可按文档类型关闭个别规则 */
export interface CleanOptions {
  /** 去除 HTML 标签与 <script>/<style> 内容（网页、混入 HTML 的 Markdown） */
  stripHtml?: boolean;
  /** 去除页码 / 页眉页脚行（PDF 抽取文本、排版文档） */
  removePageHeaders?: boolean;
  /** 去除导航、版权、广告等样板噪声行关键词 */
  removeBoilerplate?: boolean;
}

const defaultOptions: Required<CleanOptions> = {
  stripHtml: true,
  removePageHeaders: true,
  removeBoilerplate: true,
};

/** 典型页眉页脚 / 页码行：第 3 页、- 3 -、纯数字页码 */
const PAGE_LINE_RE =
  /(^\s*第\s*\d+\s*页(\s*\/\s*\d+\s*页)?\s*$)|(^\s*[-—–]\s*\d+\s*[-—–]\s*$)|(^\s*\d+\s*$)/;

/** 样板噪声关键词：导航、版权、广告、Cookie 提示等 */
const BOILERPLATE_KEYWORDS = [
  "版权所有",
  "Copyright",
  "Cookie",
  "点击订阅",
  "关注公众号",
  "返回顶部",
  "上一篇",
  "下一篇",
  "相关推荐",
  "广告",
];

/**
 * 1) 统一换行与不可见控制字符
 */
function normalizeLineBreaks(text: string): string {
  return text
    .replace(/\r\n?/g, "\n") // \r\n、\r 统一为 \n
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ""); // 删除除 \n \t 外的控制字符
}

/**
 * 2) 移除 HTML / 脚本 / 样式标签
 */
function stripHtmlTags(text: string): string {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ") // 脚本整段删除
    .replace(/<style[\s\S]*?<\/style>/gi, " ") // 样式整段删除
    .replace(/<!--[\s\S]*?-->/g, " ") // HTML 注释
    .replace(/<[^>]+>/g, " "); // 其余标签替换为空格
}

/**
 * 3) 判断一行是否为页码 / 页眉页脚噪声行
 */
function isPageHeaderLine(line: string): boolean {
  return PAGE_LINE_RE.test(line.trim());
}

/**
 * 4) 判断一行是否为样板导航 / 版权噪声
 */
function isBoilerplateLine(line: string): boolean {
  const t = line.trim();
  if (t.length === 0) return false;
  return BOILERPLATE_KEYWORDS.some((kw) => t.includes(kw));
}

/**
 * 5) 折叠空白：行内多空格归一；连续 3+ 空行压成 1 个空行
 */
function collapseWhitespace(text: string): string {
  const lines = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trimEnd());
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * 对外主入口：按顺序执行 编码/换行 → HTML → 噪声行 → 空白折叠
 */
export function cleanText(rawText: string, options: CleanOptions = {}): string {
  const opts = { ...defaultOptions, ...options };
  let text = normalizeLineBreaks(rawText);

  if (opts.stripHtml) text = stripHtmlTags(text);

  if (opts.removePageHeaders || opts.removeBoilerplate) {
    text = text
      .split("\n")
      .filter((line) => {
        if (opts.removePageHeaders && isPageHeaderLine(line)) return false;
        if (opts.removeBoilerplate && isBoilerplateLine(line)) return false;
        return true;
      })
      .join("\n");
  }

  return collapseWhitespace(text);
}
