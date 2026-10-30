"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ChatMessage, ChatSession } from "../types";

const STORAGE_KEY = "ai-webapp-sessions";

interface SessionsContextValue {
  sessions: ChatSession[];
  loaded: boolean;
  createNewSession: () => string;
  deleteSession: (id: string) => void;
  updateMessages: (sessionId: string, messages: ChatMessage[]) => void;
}

const SessionsContext = createContext<SessionsContextValue | null>(null);

// 统一创建会话，确保创建入口使用相同的数据结构。
function createSession(): ChatSession {
  const now = Date.now();
  return {
    id: `${now}-${Math.random().toString(36).slice(2)}`,
    title: "新对话",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function SessionsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loaded, setLoaded] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // React Strict Mode 在开发环境会重放 effect；避免重复读取并初始化会话。
    if (initializedRef.current) return;
    initializedRef.current = true;

    const raw = localStorage.getItem(STORAGE_KEY);
    const storedSessions = raw ? (JSON.parse(raw) as ChatSession[]) : [];
    // 首次使用时提供一个空白会话，保证聊天页始终有可用会话。
    const initialSessions = storedSessions.length > 0 ? storedSessions : [createSession()];

    setSessions(initialSessions);
    setLoaded(true);
  }, []);

  useEffect(() => {
    // 等本地数据加载完成后再保存，避免初始空数组覆盖已有数据。
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [loaded, sessions]);

  const createNewSession = useCallback(() => {
    const session = createSession();
    // 使用函数式更新，基于最新状态添加会话，避免闭包捕获过期列表。
    setSessions((current) => [session, ...current]);
    return session.id;
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((current) => {
      const remaining = current.filter((session) => session.id !== id);
      // 不允许删除后变成空列表，最后一个会话被删除时自动补建一个。
      return remaining.length > 0 ? remaining : [createSession()];
    });
  }, []);

  const updateMessages = useCallback((sessionId: string, messages: ChatMessage[]) => {
    // 仅更新目标会话，并用第一条用户消息生成会话标题。
    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages,
              title:
                messages.find((message) => message.role === "user")?.content.slice(0, 20) ||
                session.title,
              updatedAt: Date.now(),
            }
          : session
      )
    );
  }, []);

  const value = useMemo(
    () => ({ sessions, loaded, createNewSession, deleteSession, updateMessages }),
    [sessions, loaded, createNewSession, deleteSession, updateMessages]
  );

  // Provider 让侧边栏和页面共用同一份会话状态。
  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>;
}

export function useSessions() {
  const context = useContext(SessionsContext);
  if (!context) {
    // 尽早指出 Provider 缺失，避免组件误以为会话状态正常可用。
    throw new Error("useSessions must be used within a SessionsProvider");
  }
  return context;
}
