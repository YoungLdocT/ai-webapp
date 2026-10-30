import type { KnowledgeChunk, RetrievedChunk } from "./types";

/**
 * ============================================================
 * 检索器（Retriever）—— 本阶段：关键词词频打分（零依赖、纯 TS）
 * ============================================================
 *
 * 【作业体会点】
 * 整条 RAG 链路 = 检索 → 拼上下文 → 生成。
 * 今天用“关键词命中 / 词频打分”做检索；Day25/27 学完 Embedding 与向量库后，
 * 只需要把下面 scoreChunk() 的打分规则换成“问题向量与块向量的余弦相似度”，
 * 其余 knowledge.ts、buildPrompt.ts、ragService.ts、前端页面 一行都不用改。
 *
 * 对外接口保持稳定：
 *   retrieve(question, topK): RetrievedChunk[]
 */

/** 疑问虚词 / 通用停用词，不参与打分，避免“什么、怎么、吗”干扰排序 */
const STOP_WORDS = new Set([
  "的", "了", "是", "我", "你", "他", "她", "它", "们", "和", "在",
  "什么", "怎么", "怎么样", "为什么", "吗", "呢", "吧", "啊", "请问", "这个",
  "项目", "一下", "可以", "能不能", "有没有", "哪些", "哪个", "介绍", "关于",
  "哪里", "一首", "一下",
]);

/**
 * 分词（教学简化版，零依赖）：
 * - 英文单词、连续数字整体成词（转小写）
 * - 中文按「双字滑窗 bigram」切分，避免单字（如“天、一、关”）造成跨文档误命中；
 *   后续正式中文检索可替换为 jieba / 分词库，本函数之外的链路不变。
 */
function tokenize(text: string): string[] {
  const tokens: string[] = [];
  const lower = text.toLowerCase();

  let match: RegExpExecArray | null;

  // 英文 / 数字整体成词
  const wordRe = /[a-z0-9]+/g;
  while ((match = wordRe.exec(lower)) !== null) {
    if (!STOP_WORDS.has(match[0])) tokens.push(match[0]);
  }

  // 中文连续段做双字滑窗
  const zhRe = /[\u4e00-\u9fa5]+/g;
  while ((match = zhRe.exec(lower)) !== null) {
    const seg = match[0];
    if (seg.length === 1) {
      if (!STOP_WORDS.has(seg)) tokens.push(seg);
      continue;
    }
    for (let i = 0; i < seg.length - 1; i++) {
      const gram = seg.slice(i, i + 2);
      if (!STOP_WORDS.has(gram)) tokens.push(gram);
    }
  }

  return tokens;
}

/** 统计一段文本里每个 token 的出现次数（词频） */
function termFrequency(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const token of tokenize(text)) {
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }
  return freq;
}

/**
 * 给单个知识块打分：
 * 问题中的每个关键词，在正文出现一次得 1 分；在标题出现一次得 2 分（标题更相关，加权）。
 * 所有关键词得分累加，即为该块与问题的相关度分数。
 */
function scoreChunk(question: string, chunk: KnowledgeChunk): number {
  const questionTokens = tokenize(question);
  if (questionTokens.length === 0) return 0;

  const bodyFreq = termFrequency(chunk.content);
  const titleFreq = termFrequency(chunk.title);

  let score = 0;
  for (const token of questionTokens) {
    score += bodyFreq.get(token) ?? 0;
    score += (titleFreq.get(token) ?? 0) * 2; // 标题命中加权
  }
  return score;
}

/**
 * 检索入口：对知识库全部块打分 → 过滤 0 分 → 按分数降序 → 取前 topK 个。
 * 分数为 0 表示知识库完全未收录该问题。
 */
export function retrieve(
  question: string,
  chunks: KnowledgeChunk[],
  topK = 2
): RetrievedChunk[] {
  const scored: RetrievedChunk[] = chunks
    .map((chunk) => ({ ...chunk, score: scoreChunk(question, chunk) }))
    .filter((chunk) => chunk.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
