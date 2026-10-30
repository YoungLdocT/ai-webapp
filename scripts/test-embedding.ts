// scripts/test-embedding.ts
import { embed, cosineSimilarity } from "@/rag/embedding";

async function runExperiment() {
  // 测试句子组
  const sentences = [
    "今天天气很不错",
    "今天的天气很好", // ✅ 同义
    "今天狂风暴雨，非常糟糕", // ❌ 反义
    "React是一个前端框架", // 📌 无关
  ];

  console.log("正在生成向量...");
  const vectors = await embed(sentences);

  const [v1, v2, v3, v4] = vectors;

  console.log("\n===== 相似度结果 =====");
  console.log(`"${sentences[0]}" VS "${sentences[1]}"（同义）：`, cosineSimilarity(v1, v2));
  console.log(`"${sentences[0]}" VS "${sentences[2]}"（反义）：`, cosineSimilarity(v1, v3));
  console.log(`"${sentences[0]}" VS "${sentences[3]}"（无关）：`, cosineSimilarity(v1, v4));
}

runExperiment().catch(console.error);
