/**
 * 网页（HTML）Loader
 * 职责：HTML → 删除 script/style/注释 → 剥离标签 → 去导航版权噪声 → 提取 <title>。
 * 真实项目可替换为 cheerio / readability 做正文抽取，本骨架用正则完成基础清洗。
 */
import { cleanText } from "./clean";
import type { RawDocument } from "../types";
import type { LoadInput } from "./markdown";

/** 提取 <title> 文本 */
function extractHtmlTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, " ").trim() : undefined;
}

export function loadWebPage({ source, rawText, metadata = {} }: LoadInput): RawDocument {
  const cleanedText = cleanText(rawText, {
    stripHtml: true,
    removePageHeaders: false, // 网页没有 PDF 式页码
    removeBoilerplate: true,
  });

  return {
    source,
    type: "web",
    title: extractHtmlTitle(rawText),
    rawText,
    cleanedText,
    metadata,
  };
}
