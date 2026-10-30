/**
 * 纯文本（txt）Loader
 * 职责：读取纯文本 → 清洗换行 / 控制字符 / 页眉页脚 / 样板噪声 → 封装成 RawDocument。
 * txt 没有标题层级，title 由调用方通过 metadata 传入，否则缺省。
 */
import { cleanText } from "./clean";
import type { RawDocument } from "../types";
import type { LoadInput } from "./markdown";

export function loadPlainText({ source, rawText, metadata = {} }: LoadInput): RawDocument {
  const cleanedText = cleanText(rawText, {
    stripHtml: false, // 纯文本里的 < > 不一定是标签，不做 HTML 剥离
    removePageHeaders: true,
    removeBoilerplate: true,
  });

  return {
    source,
    type: "txt",
    title: typeof metadata.title === "string" ? metadata.title : undefined,
    rawText,
    cleanedText,
    metadata,
  };
}
