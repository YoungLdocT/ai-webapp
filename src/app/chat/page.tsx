"use client";

import { useCallback, useMemo, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };

    setMessages([...messages, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages([...messages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...messages, { role: "assistant", content: `出错了：${data.error}` }]);
      }
    } catch (error) {
      setMessages([...messages, { role: "assistant", content: "网络异常，请重试" }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <main className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">AI 聊天</h1>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 space-y-3">
        {messages.length === 0 && <p className="text-gray-400 text-center">开始和 AI 对话吧</p>}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === "user" ? "bg-blue-100 ml-auto max-w-[80%]" : "bg-gray-100 max-w-[80%]"
            }`}>
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-500">AI 正在思考...</p>}
      </div>

      {/* 输入框 */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="输入消息..."
          className="flex-1 border rounded px-3 py-2"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
          发送
        </button>
      </div>
    </main>
  );
}
