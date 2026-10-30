import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SessionsProvider } from "@/lib/hooks/useSessions";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Webapp",
  description: "Next.js App Router Demo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} flex h-screen overflow-hidden`}>
        {/* 全局导航，切换页面不会刷新 */}
        <SessionsProvider>
          {/* 将 Provider 放在共享布局中，让侧边栏和页面访问同一份会话状态。 */}
          <nav className="flex flex-col items-center p-4 bg-slate-100 mb-6">
            <Link href="/" className="mr-4">
              🏠 首页
            </Link>
            <Link href="/about" className="mr-4">
              ℹ️ 关于
            </Link>
            <Link href="/chat" className="mr-4">
              ℹ️ 聊天
            </Link>
          </nav>
          <main className="container p-4 mx-auto px-4">{children}</main>
        </SessionsProvider>
      </body>
    </html>
  );
}
