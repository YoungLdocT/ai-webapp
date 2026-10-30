import { getDictionary } from "@dict/index";
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  //获取语言
  const { lang } = await params;
  //获取字典 lang = zh/en/ja/ko等
  const dictionary = await getDictionary(lang);
  //返回页面
  return (
    <div>
      <h1>{dictionary.title}</h1>
      <p>{dictionary.description}</p>
      <p>{dictionary.keywords}</p>
    </div>
  );
}
