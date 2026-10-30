import { knowledgeBase } from "./knowledge";
import { retrieve } from "./retriever";
import { buildRagMessages, type RagMessage } from "./buildPrompt";
import type { RagAnswer, RetrievedChunk } from "./types";

/**
 * RAG 主流程编排（在线阶段的核心入口）
 *
 * 固定三步，与检索算法解耦：
 *   1. retrieve  检索：问题 → 相关知识块
 *   2. buildPrompt 增强：把知识块拼进 prompt，加上边界约束
 *   3. 调用 LLM 生成：模型只依据资料输出答案
 *
 * chatFn 通过参数注入：本地脚本传 Node 版 OpenAI 调用，
 * Next.js 路由传服务端 OpenAI / AI SDK 调用，本文件不关心具体模型。
 */
export type ChatFn = (messages: RagMessage[]) => Promise<string>;

export async function answerWithRag(
  question: string,
  chatFn: ChatFn,
  topK = 2
): Promise<RagAnswer> {
  // 第 1 步：检索相关知识块（当前为关键词词频打分，后续可替换为向量相似度）
  const sources: RetrievedChunk[] = retrieve(question, knowledgeBase, topK);
  const hasContext = sources.length > 0;

  // 第 2 步：拼 prompt（资料 + 边界约束）
  const messages = buildRagMessages(question, sources);

  // 第 3 步：调用大模型生成回答
  const answer = await chatFn(messages);

  return { answer, sources, hasContext };
}
