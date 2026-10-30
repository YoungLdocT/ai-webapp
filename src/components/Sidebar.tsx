"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessions } from "@/lib/hooks/useSessions";

interface SidebarProps {
  activeId?: string;
}

export default function Sidebar({ activeId }: SidebarProps) {
  const router = useRouter();
  const { sessions, createNewSession, deleteSession } = useSessions();

  const handleCreate = () => {
    const newId = createNewSession();
    // 新建后直接进入新会话。
    router.push(`/chat/${newId}`);
  };

  return (
    <aside className="w-64 h-full bg-slate-50 border-r p-4 flex flex-col">
      <button
        onClick={handleCreate}
        className="w-full py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600">
        + 新建对话
      </button>

      <div className="flex-1 overflow-y-auto space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group flex items-center justify-between p-2 rounded ${
              activeId === session.id ? "bg-blue-100" : "hover:bg-slate-200"
            }`}>
            <Link href={`/chat/${session.id}`} className="truncate flex-1 text-sm">
              {session.title}
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteSession(session.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-red-500 text-xs px-1">
              删除
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
