import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

    const response = await client.chat.completions.create({
      model: process.env.LLM_MODEL || "deepseek-flash",
      messages: [
        { role: "system", content: "你是一个友好的智能助手" },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content ?? "";

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    return NextResponse.json({ error: "服务调用失败，请稍后重试" }, { status: 500 });
  }
}
