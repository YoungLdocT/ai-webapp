import type { RetrievedChunk } from "./types";

/**
 * Prompt 组装器（Augmentation 增强环节）
 * 把检索到的知识块拼进 prompt，并用强约束限制模型只能依据资料回答。
 */

/** 系统提示词：限定回答边界 + 要求可溯源 */
export const RAG_SYSTEM_PROMPT = `你是一个基于内部知识库回答问题的助手。

【回答规则，必须严格遵守】
1. 只能依据下方【参考资料】中的内容回答，不得使用你自己的通用知识补充资料以外的事实。
2. 如果【参考资料】为空，或资料中找不到与问题相关的信息，必须直接回答：
   “根据现有资料，我无法回答这个问题。” 禁止编造、禁止推测。
3. 回答要简洁、准确；引用资料中的关键结论时，在句末用 [chunk-xx] 标注来源编号。
4. 不要输出参考资料以外的建议、评价或扩展知识。`;

/** 把命中的知识块格式化成编号资料文本 */
function formatContext(sources: RetrievedChunk[]): string {
  return sources
    .map(
      (s) =>
        `【${s.id}｜${s.title}｜来源：${s.source}】\n${s.content}`
    )
    .join("\n\n");
}

/** OpenAI 格式消息（与你 Day1 写的 chat() 消息结构保持一致） */
export interface RagMessage {
  role: "system" | "user";
  content: string;
}

/**
 * 根据问题和检索结果组装 messages。
 * 未检索到资料时，参考资料区域为空，模型按规则必须回答“不知道”。
 */
export function buildRagMessages(
  question: string,
  sources: RetrievedChunk[]
): RagMessage[] {
  const context =
    sources.length > 0
      ? formatContext(sources)
      : "（无检索到的相关资料）";

  const userContent = `【参考资料】
${context}

【用户问题】
${question}

请根据上面的参考资料回答问题。`;

  return [
    { role: "system", content: RAG_SYSTEM_PROMPT },
    { role: "user", content: userContent },
  ];
}
