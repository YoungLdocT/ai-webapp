// "use client";

// import { FormEvent, Suspense, useCallback, useMemo, useRef, useState } from "react";
// import { useChat } from "@ai-sdk/react";
// import ChatContent from "./ChatContent";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// export default function ChatPage() {
//   const [messages, setMessages] = useState<(Message & { id: string })[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const abortControllerRef = useRef<AbortController | null>(null);

//   const handleSend = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: input.trim(),
//     } as const;

//     // 先追加用户消息
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);
//     setError(null);

//     // 创建中止控制器
//     const abortController = new AbortController();
//     abortControllerRef.current = abortController;

//     // 初始化 AI 空消息，后续逐字填充
//     const aiMessageId = (Date.now() + 1).toString();
//     setMessages((prev) => [...prev, { id: aiMessageId, role: "assistant", content: "" }]);

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           messages: [...messages, userMessage].map((m) => ({
//             role: m.role,
//             content: m.content,
//           })),
//         }),
//         signal: abortController.signal, // 绑定中止信号
//       });

//       if (!response.ok) {
//         throw new Error(`请求失败：HTTP ${response.status}`);
//       }

//       // ===== 核心：读取流式响应 =====
//       const reader = response.body?.getReader();
//       const decoder = new TextDecoder();
//       if (!reader) throw new Error("无法读取响应流");

//       let fullText = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         // 二进制块解码为文本
//         const chunkText = decoder.decode(value, { stream: true });

//         // 按 SSE 格式拆分多条消息（\n\n 分隔）
//         const lines = chunkText.split("\n\n");
//         for (const line of lines) {
//           if (!line.startsWith("data: ")) continue;
//           const dataStr = line.slice(6);

//           // 识别结束标记
//           if (dataStr === "[DONE]") continue;

//           try {
//             const data = JSON.parse(dataStr);
//             if (data.content) {
//               fullText += data.content;
//               // 实时更新消息，实现打字机效果
//               setMessages((prev) =>
//                 prev.map((msg) => (msg.id === aiMessageId ? { ...msg, content: fullText } : msg))
//               );
//             }
//           } catch {
//             // 网络粘包导致的不完整 JSON，直接跳过
//           }
//         }
//       }
//     } catch (errany) {
//       // 用户主动中止不算错误
//       if (err.name !== "AbortError") {
//         setError(err.message || "请求异常");
//       }
//     } finally {
//       setIsLoading(false);
//       abortControllerRef.current = null;
//     }
//   };

//   return (
//     <main className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
//       <h1 className="text-2xl font-bold mb-4">AI 聊天</h1>

//       {/* 消息列表 */}
//       <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 space-y-3">
//         {messages.length === 0 && <p className="text-gray-400 text-center">开始和 AI 对话吧</p>}
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-2 rounded ${
//               msg.role === "user" ? "bg-blue-100 ml-auto max-w-[80%]" : "bg-gray-100 max-w-[80%]"
//             }`}>
//             {msg.content}
//           </div>
//         ))}
//         {isLoading && <p className="text-gray-500">AI 正在思考...</p>}
//       </div>

//       {/* 输入框 */}
//       <div className="flex gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           placeholder="输入消息..."
//           className="flex-1 border rounded px-3 py-2"
//           disabled={isLoading}
//         />
//         <button
//           onClick={handleSend}
//           disabled={isLoading}
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
//           发送
//         </button>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessions } from "@/lib/hooks/useSessions";

export default function ChatRootPage() {
  const router = useRouter();
  const { sessions, loaded } = useSessions();
  const firstSessionId = sessions[0]?.id;

  useEffect(() => {
    // 等本地会话加载后再跳转，避免将尚未加载的空列表误判为没有会话。
    if (loaded && firstSessionId) {
      router.replace(`/chat/${firstSessionId}`);
    }
  }, [firstSessionId, loaded, router]);

  return <div className="p-4 text-gray-500">加载中...</div>;
}
