"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart, type UIMessage } from "ai";
import { Suspense, type FormEvent, useEffect, useMemo, useState } from "react";
import { useSessions } from "@/lib/hooks/useSessions";
import type { ChatMessage, ChatSession } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-4">加载中...</div>}>
      <div className="flex">
        <Sidebar />
        {/* useParams 在动态路由预渲染期间可能需要等待运行时参数。 */}
        <ChatContent />
      </div>
    </Suspense>
  );
}

function ChatContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { sessions, loaded, updateMessages } = useSessions();
  const sessionId = params.id;
  const firstSessionId = sessions[0]?.id;
  const currentSession = useMemo(
    () => sessions.find((session) => session.id === sessionId) ?? null,
    [sessions, sessionId]
  );
  const currentSessionId = currentSession?.id;

  useEffect(() => {
    // 数据加载后若 URL 中的会话不存在，跳到仍然有效的第一个会话。
    if (loaded && firstSessionId && !currentSessionId) {
      router.replace(`/chat/${firstSessionId}`);
    }
  }, [currentSessionId, firstSessionId, loaded, router]);

  if (!loaded || !currentSession) {
    return <div className="p-4">加载中...</div>;
  }

  return (
    <ActiveChat
      // 切换会话时重建 useChat 实例，避免沿用上一个会话的消息。
      key={currentSession.id}
      session={currentSession}
      updateMessages={updateMessages}
    />
  );
}

function ActiveChat({
  session,
  updateMessages,
}: {
  session: ChatSession;
  updateMessages: (sessionId: string, messages: ChatMessage[]) => void;
}) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chatsdk",
    }),
    // 将本地保存的简化消息转换为 AI SDK 的 UIMessage 格式，作为聊天初始历史。
    messages: session.messages.map(
      (message): UIMessage => ({
        id: message.id,
        role: message.role,
        parts: [{ type: "text", text: message.content }],
      })
    ),
  });

  const isGenerating = status === "submitted" || status === "streaming";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = input.trim();
    if (!text || isGenerating) return;

    setInput("");
    await sendMessage({ text });
  };

  useEffect(() => {
    // SDK 消息按 parts 存放文本；转成应用的存储格式后写回当前会话。
    const savedMessages: ChatMessage[] = messages.map((message) => ({
      id: message.id,
      role: message.role === "user" ? "user" : "assistant",
      content: message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(""),
      createdAt: Date.now(),
    }));

    updateMessages(session.id, savedMessages);
  }, [messages, session.id, updateMessages]);

  return (
    <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Agent 工具调用演示</h1>

      <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center">
            试试问：搜索2026AI市场规模，再计算增长3倍是多少
          </p>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.parts
              .filter((part) => part.type === "text")
              .map((part, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    message.role === "user"
                      ? "bg-blue-100 ml-auto max-w-[80%]"
                      : "bg-gray-100 max-w-[80%]"
                  }`}>
                  {part.text}
                </div>
              ))}

            {message.parts.filter(isToolUIPart).map((part) => (
              <div
                key={part.toolCallId}
                className="border border-blue-200 bg-blue-50 p-3 rounded text-sm">
                <div className="font-medium text-blue-700">🔧 工具：{getToolName(part)}</div>
                <div className="mt-1 text-gray-600">
                  参数：
                  <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto">
                    {JSON.stringify(part.input, null, 2)}
                  </pre>
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  状态：
                  {part.state === "output-available"
                    ? "已完成"
                    : part.state === "output-error"
                      ? "执行失败"
                      : "执行中"}
                </div>
                {part.state === "output-available" && (
                  <pre className="bg-white p-2 rounded mt-2 text-xs overflow-x-auto">
                    {JSON.stringify(part.output, null, 2)}
                  </pre>
                )}
                {part.state === "output-error" && (
                  <p role="alert" className="mt-2 text-red-600">
                    {part.errorText}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}

        {isGenerating && <p className="text-gray-500 text-sm">Agent 执行中...</p>}
        {error && (
          <p role="alert" className="text-red-600 text-sm">
            请求失败：{error.message}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          placeholder="输入消息..."
          disabled={isGenerating}
          className="flex-1 px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={stop}
          disabled={!isGenerating}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50">
          停止
        </button>
        <button
          type="submit"
          disabled={isGenerating || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
          发送
        </button>
      </form>
    </div>
  );
}
