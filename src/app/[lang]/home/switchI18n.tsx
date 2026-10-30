"use client";
import { locales } from "@dict/index";
import { usePathname, useRouter } from "next/navigation";

export default function SwitchI18n({ lang }: { lang: string }) {
  const pathname = usePathname(); // 获取当前路径
  const router = useRouter(); // 获取路由实例
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value; // 获取新语言
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`); // 替换语言
    router.replace(newPath); // 跳转新路径
  };
  return (
    <div>
      <select value={lang} onChange={handleChange}>
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale}
          </option>
        ))}
      </select>
    </div>
  );
}
