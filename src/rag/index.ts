/** RAG 模块统一出口，外部只从这里引入 */

// ---- Day24 在线问答链路 ----
export { knowledgeBase } from "./knowledge";
export { retrieve } from "./retriever";
export { buildRagMessages, RAG_SYSTEM_PROMPT, type RagMessage } from "./buildPrompt";
export { answerWithRag, type ChatFn } from "./ragService";

// ---- Day26 离线数据处理：读取 / 清洗 / 切片 ----
export {
  loadMarkdown,
  loadPlainText,
  loadWebPage,
  loadDocument,
  loadLocalFile,
  cleanText,
  type LoadInput,
} from "./loaders";
export { splitDocument, loadAndSplit, type SplitOptions } from "./splitters";

export type {
  KnowledgeChunk,
  RetrievedChunk,
  RagAnswer,
  DocType,
  RawDocument,
  DataChunk,
  ChunkMetadata,
} from "./types";
