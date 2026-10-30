/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
"use client";

import { useState, useEffect } from "react";
import type { ChatSession, ChatMessage } from "../types";

const STORAGE_KEY = "ai-webapp-sessions";

export function useSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // 初始化：从 localStorage 加载
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setSessions(JSON.parse(raw));
    } else {
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    if (sessions.length == 0) {
      createNewSession();
    }
  }, [sessions]);

  // 持久化保存
  const saveSessions = (list: ChatSession[]) => {
    setSessions(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  // 1. 新建会话，返回新 ID
  const createNewSession = (): string => {
    const id = Date.now().toString();
    const newSession: ChatSession = {
      id,
      title: "新对话",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newList = [newSession, ...sessions];
    saveSessions(newList);
    return id;
  };

  // 3. 更新当前会话的消息
  const updateMessages = (sessionId: string, messages: ChatMessage[]) => {
    const newList = sessions.map((s) =>
      s.id === sessionId
        ? {
            ...s,
            messages,
            // 自动取第一条用户消息当标题
            title: messages.find((m) => m.role === "user")?.content.slice(0, 20) || s.title,
            updatedAt: Date.now(),
          }
        : s
    );
    saveSessions(newList);
  };

  // 4. 删除会话
  const deleteSession = (id: string) => {
    const newList = sessions.filter((s) => s.id !== id);
    // 删除后如果删光了，自动补一个默认会话
    // if (sessions.length === 0) {
    //   createNewSession();
    //   return;
    // }
    saveSessions(newList);
  };

  return {
    sessions,
    createNewSession,
    deleteSession,
    updateMessages,
  };
}
