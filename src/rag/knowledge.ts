import type { KnowledgeChunk } from "./types";

/**
 * 离线阶段的“知识库”：先用一个静态数组代替真实文档库。
 * 真实项目里，这里的数据来自：上传文档 → 解析 → 切片 → 入库（向量库/数据库）。
 *
 * 这里共 4 个知识块，内容是本 ai-webapp 项目自身的说明，方便课堂测试：
 * 问“已收录”的问题能命中，问“未收录”的问题得分为 0，模型应说不知道。
 */
export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: "chunk-01",
    title: "技术栈",
    source: "项目 README.md",
    content:
      "本项目基于 Next.js 14 的 App Router 搭建，使用 TypeScript 开发；" +
      "AI 层使用 Vercel AI SDK v6 对接大模型，样式使用 Tailwind CSS，" +
      "主题切换使用 next-themes，Markdown 渲染使用 react-markdown 与代码高亮组件。",
  },
  {
    id: "chunk-02",
    title: "核心功能",
    source: "项目 README.md",
    content:
      "应用支持 SSE 流式聊天，文字逐字输出，生成过程中可以点击停止；" +
      "内置搜索、计算器等工具，由 Agent 自动多步调用并在前端展示调用过程；" +
      "支持多会话管理，会话消息保存在浏览器 localStorage，刷新不丢失；" +
      "页面提供深色 / 浅色模式切换，并做了移动端响应式适配。",
  },
  {
    id: "chunk-03",
    title: "部署方式",
    source: "部署文档",
    content:
      "项目通过 Vercel 部署上线：先把代码推送到 GitHub 仓库，在 Vercel 控制台导入仓库，" +
      "在环境变量页面配置 LLM_API_KEY、LLM_BASE_URL、LLM_MODEL 三个变量后点击 Deploy；" +
      "之后每次向 main 分支推送代码，Vercel 会自动触发新的构建与部署。" +
      "服务端密钥只在 Route Handler 中读取，不会打包进前端代码。",
  },
  {
    id: "chunk-04",
    title: "目录结构",
    source: "项目 README.md",
    content:
      "路由代码位于 src/app 目录：首页是 page.tsx，聊天页面是 chat/[id] 动态路由，" +
      "聊天流式接口位于 app/api/chat/route.ts；通用组件放在 src/components，" +
      "会话管理 Hook 放在 src/lib/hooks，全局类型定义放在 src/lib/types.ts。",
  },
];
