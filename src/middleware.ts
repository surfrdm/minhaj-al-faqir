import { NextResponse, type NextRequest } from "next/server";

/**
 * قائمة البوتات ومحركات الذكاء الاصطناعي وأدوات التجريف والهندسة العكسية المحظورة تماماً
 * AI Crawlers, Headless Browsers, Scrapers & Reverse-Engineering Cloner Bots
 */
const BLOCKED_BOT_PATTERNS = [
  // OpenAI & ChatGPT crawlers
  /gptbot/i,
  /chatgpt-user/i,
  /oai-searchbot/i,

  // Anthropic & Claude crawlers
  /claudebot/i,
  /claude-web/i,
  /anthropic-ai/i,

  // Google AI scrapers
  /google-extended/i,

  // Perplexity AI
  /perplexitybot/i,

  // ByteDance / TikTok AI
  /bytespider/i,

  // Meta / Facebook AI
  /meta-externalagent/i,
  /facebookbot/i,

  // Common Crawl & Mass scrapers
  /ccbot/i,
  /diffbot/i,
  /cohere-ai/i,
  /omgili/i,
  /omgilibot/i,

  // Popular cloning / scraping frameworks
  /scrapy/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,
  /phantomjs/i,
  /headlesschrome/i,

  // CLI HTTP clients & scrapers
  /curl/i,
  /wget/i,
  /python-requests/i,
  /aiohttp/i,
  /httpx/i,
  /go-http-client/i,
  /java\//i,
  /postmanruntime/i,
  /axios/i,
  /node-fetch/i,
  /node-superagent/i,
  /urllib/i,
  /httpclient/i,
  /winhttp/i,

  // Aggressive SEO & scraping bots
  /semrushbot/i,
  /ahrefsbot/i,
  /dotbot/i,
  /mj12bot/i,
  /dataforseobot/i,
];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const { pathname } = request.nextUrl;

  // السماح بالملفات الثابتة الضرورية جداً للمتصفحات (خطوط، صور) فقط إذا كان المستخدم عادياً
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg");

  // 1. حظر أي طلب لا يحتوي على User-Agent إطلاقاً (أدوات التجريف البسيطة)
  if (!userAgent || userAgent.trim().length === 0) {
    return new NextResponse(
      JSON.stringify({
        error: "ACCESS_DENIED",
        message: "Automated scraping tools are strictly forbidden.",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2. التحقق من تطابق User-Agent مع أي بوت تجريف أو ذكاء اصطناعي
  const isBlockedBot = BLOCKED_BOT_PATTERNS.some((pattern) =>
    pattern.test(userAgent)
  );

  if (isBlockedBot) {
    // إرجاع كود 403 Forbidden فوراً
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>403 - وصول محظور</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #07130E; color: #FAF7F2; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .box { border: 2px solid #C5A059; padding: 40px; border-radius: 20px; max-width: 500px; background: #0B1F17; }
    h1 { color: #E5C378; margin-bottom: 12px; font-size: 24px; }
    p { color: #D1DDD6; line-height: 1.6; font-size: 14px; }
  </style>
</head>
<body>
  <div class="box">
    <h1>🔒 مَصُونٌ بِحِمَى الشَّرِيعَةِ وَالأَمَانَةِ</h1>
    <p>هذا الفضاء المعرفي التكويني خاص ومحمي بالكامل ضد التجريف الآلي والنسخ والهندسة العكسية بواسطة أدوات الذكاء الاصطناعي.</p>
    <p style="font-size: 11px; opacity: 0.6; margin-top: 20px;">Access Denied (403): Automated AI scraping, reverse engineering, and cloning are strictly prohibited.</p>
  </div>
</body>
</html>`,
      {
        status: 403,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      }
    );
  }

  // 3. إضافة ترويسات الأمان الصارمة لكل الطلبات المارة
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");

  return response;
}

export const config = {
  matcher: [
    /*
     * تطبيق الحماية على جميع المسارات باستثناء مسارات Next الداخلية الضرورية جداً
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
