/**
 * ============================================================
 * Splitters：递归语义切片 + 重叠（overlap）+ 完整元数据（Day26 作业 1、2）
 * ============================================================
 *
 * 流程：
 *   RawDocument（清洗后文本）
 *     → ① 按 Markdown 标题 / 段落解析成语义单元（保留标题层级与全局字符偏移）
 *     → ② 递归拆分：超长单元依次按 段落 → 句子 → 换行 → 空格 → 硬切 降级拆分
 *     → ③ 贪心打包：顺序合并到接近 chunkSize 封口；相邻块按 overlap 复制尾部上下文
 *     → ④ 生成 DataChunk：每个块带 source / chunkIndex / page / headingPath / 字符区间
 *
 * 参数取舍（作业 3 要能解释）：
 *   chunkSize 每块目标最大字符数；overlap 相邻块重叠字符数；minChunkSize 尾块过小并入前块。
 */
import type { RawDocument, DataChunk, ChunkMetadata } from "./types";

// ---------- 切片参数 ----------
export interface SplitOptions {
  /** 每块目标最大字符数，默认 500 */
  chunkSize?: number;
  /** 相邻块重叠字符数，默认 80；必须小于 chunkSize */
  overlap?: number;
  /** 末尾不足该长度的小块并入前一块，默认 120 */
  minChunkSize?: number;
}

const DEFAULT_OPTIONS: Required<SplitOptions> = {
  chunkSize: 500,
  overlap: 80,
  minChunkSize: 120,
};

/** 中间态语义单元：文本 + 标题路径 + 在清洗后全文中的字符区间 */
interface Fragment {
  text: string;
  headingPath: string[];
  start: number;
  end: number;
}

const HEADING_RE = /^\s*(#{1,6})\s+(.+?)\s*#*\s*$/;

/** 递归拆分时使用的分隔符优先级（越靠前越优先在该边界切分） */
const RECURSIVE_SEPARATORS = ["\n\n", "。", "！", "？", "；", "\n", " "];

/**
 * 给块标题路径前缀预留的字符预算：
 * 递归拆分按「正文预算」执行，保证片段加上【层级路径】前缀后仍不超过 chunkSize。
 */
const PREFIX_RESERVE = 40;

/* ------------------------------------------------------------
 * ① 解析 Markdown 标题层级与段落单元，记录全局字符偏移
 * ---------------------------------------------------------- */
function parseSemanticUnits(doc: RawDocument): Fragment[] {
  const text = doc.cleanedText;
  if (!text.trim()) return [];

  const lines = text.split("\n");

  // 每行在全文中的起始偏移（用于元数据 charStart / charEnd 溯源）
  const lineStarts: number[] = [];
  let cursor = 0;
  for (const line of lines) {
    lineStarts.push(cursor);
    cursor += line.length + 1;
  }

  const units: Fragment[] = [];
  const stack: { level: number; title: string }[] = [];
  let buf: string[] = [];
  let bufStartLine = -1;

  const headingPath = () => stack.map((s) => s.title);

  /** 把当前缓冲段落封口成一个单元 */
  const flushParagraph = (endLine: number) => {
    if (buf.length === 0 || bufStartLine < 0) return;
    const para = buf.join("\n").trim();
    if (para) {
      units.push({
        text: para,
        headingPath: headingPath(),
        start: lineStarts[bufStartLine],
        end: lineStarts[endLine] + lines[endLine].length,
      });
    }
    buf = [];
    bufStartLine = -1;
  };

  // 只有 Markdown 才把 # 识别为标题层级，txt/web 中 # 只是普通字符
  const parseHeading = doc.type === "markdown";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const heading = parseHeading ? line.match(HEADING_RE) : null;

    if (heading) {
      // 标题先封口上一章节段落
      flushParagraph(i - 1);
      const level = heading[1].length;
      const title = heading[2].trim();
      // 弹出同级及更深层级，维护层级栈
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      stack.push({ level, title });
      // 标题不单独作为打包单元：它只更新层级路径，标题文字通过块前缀
      // （prefixOf 的【层级路径】）注入到所属段落块，既保证归属清晰又不产生标题碎片块。
      continue;
    }

    if (line.trim() === "") {
      flushParagraph(i - 1);
      continue;
    }

    if (bufStartLine < 0) bufStartLine = i;
    buf.push(line);
  }
  flushParagraph(lines.length - 1);

  return units;
}

/* ------------------------------------------------------------
 * ② 递归拆分：超长单元逐级降级到句子 / 换行 / 空格 / 硬切
 * ---------------------------------------------------------- */
function splitKeepingSeparator(
  text: string,
  separator: string
): { text: string; offset: number }[] {
  const parts: { text: string; offset: number }[] = [];
  let offset = 0;
  // 用分隔符切分并保留分隔符在段尾，避免语义粘连
  const segments = text.split(separator);
  segments.forEach((seg, idx) => {
    const piece = idx < segments.length - 1 ? seg + separator : seg;
    if (piece.trim().length > 0) parts.push({ text: piece, offset });
    offset += piece.length;
  });
  return parts;
}

function recursiveSplit(
  unit: Fragment,
  chunkSize: number,
  level: number
): Fragment[] {
  if (unit.text.length <= chunkSize) return [unit];

  const separator = RECURSIVE_SEPARATORS[level];
  // 已无更优分隔符：按 chunkSize 硬切兜底
  if (!separator) {
    const out: Fragment[] = [];
    for (let s = 0; s < unit.text.length; s += chunkSize) {
      const piece = unit.text.slice(s, s + chunkSize);
      out.push({
        text: piece,
        headingPath: unit.headingPath,
        start: unit.start + s,
        end: unit.start + s + piece.length,
      });
    }
    return out;
  }

  const subParts = splitKeepingSeparator(unit.text, separator);
  const out: Fragment[] = [];
  for (const part of subParts) {
    out.push(
      ...recursiveSplit(
        {
          text: part.text,
          headingPath: unit.headingPath,
          start: unit.start + part.offset,
          end: unit.start + part.offset + part.text.length,
        },
        chunkSize,
        level + 1
      )
    );
  }
  return out;
}

/* ------------------------------------------------------------
 * ③ 贪心打包 + overlap 滑窗 + 元数据生成
 * ---------------------------------------------------------- */
interface PackedBlock {
  units: Fragment[];
  text: string;
  /** 正文片段原始长度（不含标题前缀与连接换行） */
  rawLen: number;
}

/** 标题路径前缀文本（Markdown 块前置归属路径，保证上下文不丢） */
function prefixOf(units: Fragment[]): string {
  const path = units[0]?.headingPath ?? [];
  return path.length > 0 ? `【${path.join(" / ")}】\n` : "";
}

/** 把一组单元合并成块正文；Markdown 块前置标题路径，保证归属上下文不丢 */
function composeBlockText(units: Fragment[]): string {
  const body = units.map((u) => u.text).join("\n\n");
  return prefixOf(units) + body;
}

/** 估算一组单元打包后的总长度：标题前缀 + 片段正文 + 片段间连接换行 */
function packedLength(units: Fragment[], rawLen: number): number {
  const joins = Math.max(0, units.length - 1) * 2; // 每个 "\n\n" 占 2 字符
  return prefixOf(units).length + rawLen + joins;
}

export function splitDocument(doc: RawDocument, options: SplitOptions = {}): DataChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 参数自检与修正：overlap 不得接近或超过 chunkSize
  if (opts.overlap >= opts.chunkSize) {
    opts.overlap = Math.max(0, Math.floor(opts.chunkSize / 4));
  }

  const rawUnits = parseSemanticUnits(doc);

  // 正文预算：扣除标题前缀预留，避免片段加前缀后整体超过 chunkSize
  const bodyBudget = Math.max(80, opts.chunkSize - PREFIX_RESERVE);

  // 递归拆分所有超长单元，得到最小语义片段
  const fragments: Fragment[] = rawUnits.flatMap((u) =>
    recursiveSplit(u, bodyBudget, 0)
  );

  // 贪心打包：预留标题前缀与连接换行开销，避免封口后整体超过 chunkSize
  const blocks: PackedBlock[] = [];
  let current: Fragment[] = [];
  let currentRawLen = 0;

  const closeBlock = () => {
    if (current.length === 0) return;
    blocks.push({
      units: current,
      text: composeBlockText(current),
      rawLen: currentRawLen,
    });
    current = [];
    currentRawLen = 0;
  };

  for (const frag of fragments) {
    if (current.length > 0) {
      const trialRawLen = currentRawLen + frag.text.length;
      if (packedLength([...current, frag], trialRawLen) > opts.chunkSize) {
        closeBlock();
      }
    }
    current.push(frag);
    currentRawLen += frag.text.length;
  }
  closeBlock();

  // 尾块过小：仅当合并后不超过 chunkSize 才并入前一块，避免把前一块撑爆
  if (blocks.length >= 2) {
    const tail = blocks[blocks.length - 1];
    const prev = blocks[blocks.length - 2];
    const mergedRawLen = prev.rawLen + tail.rawLen;
    if (
      tail.text.length < opts.minChunkSize &&
      packedLength([...prev.units, ...tail.units], mergedRawLen) <= opts.chunkSize
    ) {
      prev.units.push(...tail.units);
      prev.rawLen = mergedRawLen;
      prev.text = composeBlockText(prev.units);
      blocks.pop();
    }
  }

  // 生成 DataChunk，相邻块按 overlap 复制上一块尾部作为上下文衔接
  const chunks: DataChunk[] = [];
  blocks.forEach((block, index) => {
    let content = block.text;

    if (opts.overlap > 0 && index > 0) {
      const prevContent = chunks[index - 1].content;
      const tail = prevContent.slice(-opts.overlap);
      if (tail.trim().length > 0) {
        content = `${tail}\n\n${content}`;
      }
    }

    const first = block.units[0];
    const last = block.units[block.units.length - 1];

    const metadata: ChunkMetadata = {
      source: doc.source,
      chunkIndex: index,
      page: doc.page,
      headingPath: first.headingPath,
      charStart: first.start,
      charEnd: last.end,
      charCount: content.length,
    };

    chunks.push({
      id: `${doc.source}#${String(index).padStart(3, "0")}`,
      content,
      metadata,
    });
  });

  return chunks;
}

/** 便捷组合：loader 输出 → 直接切片 */
export function loadAndSplit(doc: RawDocument, options?: SplitOptions): DataChunk[] {
  return splitDocument(doc, options);
}

export type { DataChunk, ChunkMetadata };
