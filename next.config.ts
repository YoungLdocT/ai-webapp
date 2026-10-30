import type { NextConfig } from "next";

import { PHASE_DEVELOPMENT_SERVER, PHASE_TYPE } from "next/constants";

module.exports = (_phase: PHASE_TYPE) => {
  const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
      agentFeedback: true,
    },
    cacheComponents: true,
    partialPrefetching: true,
    reactCompiler: false,
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
        "*.less": {
          loaders: ["less-loader"],
          as: "*.css",
        },
      },
    },
    // output: "export", // 导出静态站点
    distDir: "dist", // 导出目录
    trailingSlash: true, // 添加尾部斜杠，生成 /about/index.html 而不是 /about.html
    images: {
      remotePatterns: [
        {
          protocol: "https", // 协议
          hostname: "eo-img.521799.xyz", // 主机名
          pathname: "/i/pc/**", // 路径
          port: "", // 端口
        },
      ],
      formats: ["image/avif", "image/webp"], //默认是 ['image/webp']
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // 设备尺寸
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 图片尺寸
    },
    headers: () => {
      return [
        {
          source: "/:path*", // 匹配路径 所有路径 也支持精准匹配 例如/api/user 包括支持动态路由等 /api/user/:id
          headers: [
            {
              key: "Access-Control-Allow-Origin", //允许跨域
              value: "*", // 允许所有域名访问
            },
            {
              key: "Access-Control-Allow-Methods", //允许的请求方法
              value: "GET, POST, PUT, DELETE, OPTIONS", // 允许的请求方法
            },
            {
              key: "Access-Control-Allow-Headers", //允许的请求头
              value: "Content-Type, Authorization", // 允许的请求头
            },
          ],
        },
        {
          source: "/home", // 精准匹配 /home 路径
          headers: [
            {
              key: "X-Custom-Header", //自定义响应头
              value: "123456", // 值
            },
          ],
        },
      ];
    },
    assetPrefix: "https://cdn.example.com", // 静态资源前缀
    // basePath: "/docs", // 基础路径
    // redirects() {
    //   return [
    //     {
    //       source: "/", // 源路径
    //       destination: "/docs", // 目标路径
    //       basePath: false, // 是否使用basePath 默认情况下 source 和 destination 都会自动加上 basePath 前缀 就变成了/docs/docs 所以这儿不需要增加
    //       permanent: false, // 是否永久重定向
    //     },
    //   ];
    // },
    compress: true, // 压缩
    logging: {
      fetches: {
        fullUrl: true, // 显示完整的URL
      },
    },
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    devIndicators: false, // 关闭开发指示器
    // devIndicators:{
    //   position:'bottom-right', //也支持放入其他位置 bottom-right bottom-left top-right top-left
    // },
    generateEtags: true, // 关闭生成ETag 默认开启
  };

  // if (_phase === PHASE_DEVELOPMENT_SERVER) {
  //   nextConfig.reactCompiler = true; // 开发环境使用reactCompiler
  // }

  return nextConfig;
};
