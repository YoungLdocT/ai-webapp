/**
 * RAG 模块公共类型定义
 * 后续替换成向量检索时，这一层类型保持不变，只换 retriever 内部实现。
 */

/** 一个知识块（Chunk）：离线阶段从文档切分出来的最小检索单位 */
export interface KnowledgeChunk {
  /** 块唯一编号，回答时用于标注来源 */
  id: string;
  /** 块标题 / 主题，便于人读 */
  title: string;
  /** 块正文内容 */
  content: string;
  /** 来源文档名（可溯源用） */
  source: string;
}

/** 检索结果：知识块 + 本次检索得分 */
export interface RetrievedChunk extends KnowledgeChunk {
  score: number;
}

/** RAG 问答最终返回结构 */
export interface RagAnswer {
  /** 模型基于资料生成的回答 */
  answer: string;
  /** 命中并拼进 prompt 的知识块（前端可展示引用来源） */
  sources: RetrievedChunk[];
  /** 是否检索到相关资料；false 表示未收录，模型应回答“不知道” */
  hasContext: boolean;
}

/* ============================================================
 * Day26 数据处理阶段类型：读取 → 清洗 → 切片
 * 与上面问答阶段类型解耦，切片产物后续可映射为 KnowledgeChunk
 * ============================================================ */

/** 文档来源类型 */
export type DocType = "markdown" | "txt" | "pdf" | "web";

/** 读取并清洗后的原始文档（切片输入） */
export interface RawDocument {
  /** 来源文件名 / 路径 / URL，溯源第一关键字 */
  source: string;
  /** 文档类型 */
  type: DocType;
  /** 页码（PDF / 分页网页用；Markdown、txt 可缺省） */
  page?: number;
  /** 文档主标题（Markdown 一级标题提取） */
  title?: string;
  /** 清洗前原始文本 */
  rawText: string;
  /** 清洗后文本，切片只基于它进行 */
  cleanedText: string;
  /** 附加元数据（作者、采集时间、URL 等） */
  metadata: Record<string, unknown>;
}

/** 切片元数据：回答引用与定位溯源的依据（作业 2 要求） */
export interface ChunkMetadata {
  /** 来源文档名 / 路径 / URL */
  source: string;
  /** 本块在该文档内的序号（从 0 开始） */
  chunkIndex: number;
  /** 页码（PDF 场景；Markdown/txt 为 undefined） */
  page?: number;
  /** 标题层级路径，例如 ["技术栈", "部署方式"]，用于保留上下文归属 */
  headingPath: string[];
  /** 在清洗后全文中的字符区间（闭区间起点 / 终点） */
  charStart: number;
  charEnd: number;
  /** 本块字符数 */
  charCount: number;
}

/** 切片产物：内容 + 完整元数据 */
export interface DataChunk {
  /** 块唯一 id：来源文档 + 序号，例如 readme.md#003 */
  id: string;
  /** 块正文 */
  content: string;
  /** 溯源元数据 */
  metadata: ChunkMetadata;
}
