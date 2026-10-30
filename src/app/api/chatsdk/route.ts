import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

const calculateInputSchema = z.object({
  a: z.number().describe("第一个数字"),
  b: z.number().describe("第二个数字"),
  operator: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("运算类型：add加/subtract减/multiply乘/divide除"),
});

const calculateTool = {
  description: "执行数学四则运算，支持加减乘除。遇到算术题、数值计算时调用。",
  inputSchema: calculateInputSchema,
  execute: async ({ a, b, operator }: z.infer<typeof calculateInputSchema>) => {
    switch (operator) {
      case "add":
        return { result: a + b };
      case "subtract":
        return { result: a - b };
      case "multiply":
        return { result: a * b };
      case "divide":
        if (b === 0) throw new Error("除数不能为0");
        return { result: a / b };
    }
  },
};

const openai = createOpenAI({
  baseURL: process.env.LLM_BASE_URL, // DeepSeek 示例
  apiKey: process.env.LLM_API_KEY!,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("deepseek-chat"),
    system: "你是智能助手，可以使用工具解决问题。需要计算就调用calculate",
    messages: await convertToModelMessages(messages),
    temperature: 0.7,
    tools: {
      calculate: calculateTool,
    },
  });

  return result.toUIMessageStreamResponse();
}
