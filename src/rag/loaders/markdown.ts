/**
 * Markdown 文档 Loader
 * 职责：读取原始 Markdown 文本 → 统一清洗 → 提取主标题 → 封装成 RawDocument。
 * 标题层级路径（headingPath）由切片器在切分过程中动态维护，本 loader 只提供文档主标题。
 */
import { cleanText } from "./clean";
import type { RawDocument } from "../types";

/** 提取 Markdown 主标题：优先 # 一级标题，其次取第一个出现的标题 */
function extractTitle(md: string): string | undefined {
  const h1 = md.match(/^\s*#\s+(.+?)\s*#*\s*$/m);
  if (h1) return h1[1].trim();
  const anyHeading = md.match(/^\s*#{1,6}\s+(.+?)\s*#*\s*$/m);
  return anyHeading ? anyHeading[1].trim() : undefined;
}

export interface LoadInput {
  /** 来源文件名 / 路径 / URL，溯源第一关键字 */
  source: string;
  /** 原始文本 */
  rawText: string;
  /** 附加元数据：作者、采集时间、URL 等 */
  metadata?: Record<string, unknown>;
}

export function loadMarkdown({ source, rawText, metadata = {} }: LoadInput): RawDocument {
  const cleanedText = cleanText(rawText, {
    stripHtml: true,
    removePageHeaders: true,
    removeBoilerplate: true,
  });

  return {
    source,
    type: "markdown",
    title: extractTitle(rawText),
    rawText,
    cleanedText,
    metadata,
  };
}
