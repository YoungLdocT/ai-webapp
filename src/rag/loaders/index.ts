/**
 * Loaders 统一入口（离线阶段 · 读取 + 清洗）
 * 对外只暴露：
 *  1. loadDocument(type, input)  按文档类型分发清洗
 *  2. loadLocalFile(path)        按扩展名读取本地文件并分发
 *
 * 设计边界：loader 只负责「原始文本 → 清洗后 RawDocument」，
 * 不负责切片、向量化；切片交给 splitters.ts。
 */
import { readFile } from "node:fs/promises";
import { extname, basename } from "node:path";

import { loadMarkdown, type LoadInput } from "./markdown";
import { loadPlainText } from "./txt";
import { loadWebPage } from "./web";
import type { RawDocument, DocType } from "../types";

export { loadMarkdown } from "./markdown";
export { loadPlainText } from "./txt";
export { loadWebPage } from "./web";
export type { LoadInput } from "./markdown";
export { cleanText } from "./clean";

/** 按类型分发到对应 loader */
export function loadDocument(type: DocType, input: LoadInput): RawDocument {
  switch (type) {
    case "markdown":
      return loadMarkdown(input);
    case "txt":
      return loadPlainText(input);
    case "web":
      return loadWebPage(input);
    case "pdf":
      // PDF 需引入 pdf-parse / pdfjs-dist 做按页抽取与页码保留，
      // 本阶段零依赖不接入；晚上复杂 PDF 测试时在此扩展为「一页一个 RawDocument」。
      throw new Error(
        "PDF loader 未启用：请在后续阶段接入 PDF 解析库，并为每页保留 page 元数据。"
      );
    default: {
      const exhaustive: never = type;
      throw new Error(`未知文档类型：${exhaustive}`);
    }
  }
}

/** 根据文件扩展名推断文档类型 */
function resolveType(filePath: string): DocType {
  const ext = extname(filePath).toLowerCase();
  if (ext === ".md" || ext === ".markdown") return "markdown";
  if (ext === ".txt") return "txt";
  if (ext === ".html" || ext === ".htm") return "web";
  if (ext === ".pdf") return "pdf";
  return "txt";
}

/** 读取本地文件 → 清洗 → RawDocument；source 使用文件名便于溯源 */
export async function loadLocalFile(
  filePath: string,
  metadata: Record<string, unknown> = {}
): Promise<RawDocument> {
  const rawText = await readFile(filePath, "utf8");
  return loadDocument(resolveType(filePath), {
    source: basename(filePath),
    rawText,
    metadata: { ...metadata, filePath },
  });
}
