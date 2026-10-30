import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message != "string") {
      return NextResponse.json({ error: "消息内容不能为空" }, { status: 400 });
    }

    const stream = await client.chat.completions.create({
      model: process.env.LLM_MODEL || "deepseek-flash",
      messages: [
        { role: "system", content: "你是一个友好的智能助手" },
        { role: "user", content: message },
      ],
      stream: true,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          // 遍历大模型返回的每一块增量内容
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (!delta) continue;

            // 按 SSE 标准格式封装：data: 内容\n\n
            const sseChunk = `data: ${JSON.stringify({ content: delta })}\n\n`;
            controller.enqueue(encoder.encode(sseChunk));
          }
          // 结束标记
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "服务调用失败，请稍后重试" }, { status: 500 });
  }
}
