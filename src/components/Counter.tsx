"use client"; // ✅ 第一行必须加，声明客户端组件

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="border p-4 rounded-lg max-w-xs">
      <h2 className="text-xl mb-2">计数器</h2>
      <p className="mb-2">当前数值：{count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        +1
      </button>
    </div>
  );
}
