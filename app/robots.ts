import type { MetadataRoute } from "next";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.violethat.com"
).replace(/\/+$/, "");

// Disallowed paths — user-specific, auth, admin, and API routes
// Listed with and without trailing slash so both /admin and /admin/foo match
const DISALLOW = [
  "/api/",
  "/admin",
  "/admin/",
  "/profile",
  "/profile/",
  "/submissions",
  "/submissions/",
  "/notifications",
  "/notifications/",
  "/payment",
  "/payment/",
  "/sign-in",
  "/sign-in/",
  "/sign-up",
  "/sign-up/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Major SEO crawlers
      {
        userAgent: ["Googlebot", "Bingbot", "DuckDuckBot", "Slurp"],
        allow: "/",
        disallow: DISALLOW,
      },
      // AI / answer-engine crawlers — explicitly allowed so they can cite us
      {
        userAgent: [
          "GPTBot", // OpenAI / ChatGPT training + browsing
          "ChatGPT-User", // ChatGPT live browsing
          "OAI-SearchBot", // OpenAI SearchGPT
          "ClaudeBot", // Anthropic Claude
          "Claude-Web", // Anthropic web fetch
          "anthropic-ai", // legacy Anthropic UA
          "PerplexityBot", // Perplexity index
          "Perplexity-User", // Perplexity user-triggered fetch
          "Google-Extended", // Google AI Overviews / Gemini
          "Applebot-Extended", // Apple Intelligence
          "CCBot", // Common Crawl (powers many AI datasets)
          "Bytespider", // ByteDance / Doubao
          "Amazonbot", // Amazon Alexa / answer engine
          "Meta-ExternalAgent", // Meta AI fetch
          "Meta-ExternalFetcher",
          "DuckAssistBot", // DuckDuckGo AI
        ],
        allow: "/",
        disallow: DISALLOW,
      },
      // Default fallback for anything else
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
