import type { MetadataRoute } from "next";

// Strip trailing slash so concatenation produces clean URLs
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.violethat.com"
).replace(/\/+$/, "");

// Rebuild the sitemap hourly so new challenges show up in search engines fast
export const revalidate = 3600;

interface SitemapChallenge {
  _id: string;
  updatedAt?: string;
  createdAt?: string;
}

async function fetchChallengeIds(): Promise<SitemapChallenge[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_END_POINTS;
  if (!apiBase) return [];
  try {
    const res = await fetch(`${apiBase}/api/challenges`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: unknown = Array.isArray(data) ? data : data?.data;
    if (!Array.isArray(list)) return [];
    return (list as SitemapChallenge[]).filter((c) => c && c._id);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/challenges`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/billing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/vs/hackthebox`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/vs/tryhackme`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const challenges = await fetchChallengeIds();
  const challengeEntries: MetadataRoute.Sitemap = challenges.map((c) => ({
    url: `${BASE_URL}/challenges/${c._id}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : c.createdAt ? new Date(c.createdAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...challengeEntries];
}
