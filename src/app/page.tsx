import Counter from "../components/Counter";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">首页 Home</h1>
      <p className="mb-4">这是服务端渲染的首页页面</p>
      <Counter />
    </div>
  );
}
