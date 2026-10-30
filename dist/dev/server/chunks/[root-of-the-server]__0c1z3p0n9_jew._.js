module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/build/adapter/setup-node-env.external.js [external] (next/dist/build/adapter/setup-node-env.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/build/adapter/setup-node-env.external.js", () => require("next/dist/build/adapter/setup-node-env.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/memory-cache.external.js [external] (next/dist/server/lib/incremental-cache/memory-cache.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/memory-cache.external.js", () => require("next/dist/server/lib/incremental-cache/memory-cache.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/shared-cache-controls.external.js [external] (next/dist/server/lib/incremental-cache/shared-cache-controls.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js", () => require("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/router-utils/instrumentation-globals.external.js [external] (next/dist/server/lib/router-utils/instrumentation-globals.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/lib/router-utils/instrumentation-globals.external.js", () => require("next/dist/server/lib/router-utils/instrumentation-globals.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/dictionaries/index.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultLocale",
    ()=>defaultLocale,
    "getDictionary",
    ()=>getDictionary,
    "locales",
    ()=>locales
]);
const locales = [
    "en",
    "zh",
    "ja",
    "ko"
]; // 支持的语言
const defaultLocale = "zh";
function getDictionary(locale) {
    //例如locale为zh 则返回 src/dictionaries/zh.json
    //locale为en 则返回 src/dictionaries/en.json
    //locale为ja 则返回 src/dictionaries/ja.json
    //locale为ko 则返回 src/dictionaries/ko.json
    return __turbopack_context__.f({
        "./en.json": {
            id: ()=>"[project]/src/dictionaries/en.json.[json].cjs [middleware] (ecmascript, async loader)",
            module: ()=>__turbopack_context__.A("[project]/src/dictionaries/en.json.[json].cjs [middleware] (ecmascript, async loader)")
        },
        "./ja.json": {
            id: ()=>"[project]/src/dictionaries/ja.json.[json].cjs [middleware] (ecmascript, async loader)",
            module: ()=>__turbopack_context__.A("[project]/src/dictionaries/ja.json.[json].cjs [middleware] (ecmascript, async loader)")
        },
        "./ko.json": {
            id: ()=>"[project]/src/dictionaries/ko.json.[json].cjs [middleware] (ecmascript, async loader)",
            module: ()=>__turbopack_context__.A("[project]/src/dictionaries/ko.json.[json].cjs [middleware] (ecmascript, async loader)")
        },
        "./zh.json": {
            id: ()=>"[project]/src/dictionaries/zh.json.[json].cjs [middleware] (ecmascript, async loader)",
            module: ()=>__turbopack_context__.A("[project]/src/dictionaries/zh.json.[json].cjs [middleware] (ecmascript, async loader)")
        }
    }).import(`./${locale}.json`).then((module)=>module.default);
}
}),
"[project]/src/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$negotiator$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/negotiator/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$formatjs$2f$intl$2d$localematcher$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@formatjs/intl-localematcher/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dictionaries$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dictionaries/index.ts [middleware] (ecmascript)"); // 导入项目支持的语言和默认语言
;
;
;
;
function proxy(req, res) {
    // 如果请求路径为根路径，则直接返回 首页不做任何处理
    if (req.nextUrl.pathname === "/") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    //如果路径已经包含所支持的语言，则直接返回 例如 /zh/about /zs/home 等
    if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dictionaries$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["locales"].some((locale)=>req.nextUrl.pathname.startsWith(`/${locale}`))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // 获取请求头
    const headers = {
        "accept-language": req.headers.get("accept-language") || ""
    };
    // 解析请求头
    const negotiator = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$negotiator$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"]({
        headers
    });
    // 获取语言
    const language = negotiator.languages();
    //['zh-CN', 'zh', 'en-US', 'en', 'ja']  // 按优先级从高到低排序
    const lang = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$formatjs$2f$intl$2d$localematcher$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["match"])(language, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dictionaries$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["locales"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dictionaries$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["defaultLocale"]);
    //language-浏览器支持的语言 locales-项目支持的语言 defaultLocale-项目默认语言
    // 匹配语言例如 zh-CN 则 lang 返回 zh en-US 则 lang 返回 en 如果没有匹配到则返回默认语言defaultLocale
    const pathname = req.nextUrl.pathname;
    // 拼接语言
    req.nextUrl.pathname = `/${lang}${pathname}`;
    // 重定向 例如用户访问的是/home 我们则读取语言后重定向到/zh/home 给它增加语言前缀
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(req.nextUrl);
}
const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0c1z3p0n9_jew._.js.map