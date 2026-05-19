import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/components/landing/pricing-data";
import ChallengeEditor from "./ChallengeEditor";

// Revalidate detail pages every 10 minutes
export const revalidate = 600;

interface ChallengeDetail {
  _id: string;
  title: string;
  difficulty?: string;
  topic?: string[];
  keywords?: string[];
  problemStatement?: string;
  codeTemplate?: string;
  constraints?: string[];
  companies?: string[];
  paymentMode?: string;
  acceptanceRate?: number;
  submissions?: number;
  createdAt?: string;
  updatedAt?: string;
}

async function fetchChallenge(id: string): Promise<ChallengeDetail | null> {
  const base = process.env.NEXT_PUBLIC_API_END_POINTS;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/challenges/${id}`, {
      next: { revalidate: 600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const challenge: unknown =
      data && typeof data === "object" && "data" in data ? data.data : data;
    if (!challenge || typeof challenge !== "object") return null;
    return challenge as ChallengeDetail;
  } catch {
    return null;
  }
}

// Strip HTML tags and collapse whitespace — for meta description + JSON-LD text
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max - 30 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ q_id: string }>;
}): Promise<Metadata> {
  const { q_id } = await params;
  const challenge = await fetchChallenge(q_id);
  if (!challenge) {
    return {
      title: "Challenge not found",
      description: "The challenge you are looking for could not be found.",
      alternates: { canonical: `/challenges/${q_id}` },
      robots: { index: false, follow: false },
    };
  }

  const description = truncate(
    stripHtml(challenge.problemStatement || ""),
    160,
  ) ||
    `Hands-on cybersecurity coding challenge on Violethat: ${challenge.title}.`;

  const titleParts = [challenge.title];
  if (challenge.difficulty) titleParts.push(`${challenge.difficulty} difficulty`);
  titleParts.push("Detection engineering challenge");
  const title = titleParts.join(" — ");

  const keywords = [
    challenge.title,
    ...(challenge.topic || []),
    ...(challenge.keywords || []),
    ...(challenge.companies || []),
    "cybersecurity coding challenge",
    "detection engineering lab",
    "Violethat",
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/challenges/${q_id}` },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "article",
      url: `/challenges/${q_id}`,
      title,
      description,
      siteName: "Violethat",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function ChallengeJsonLd({ challenge }: { challenge: ChallengeDetail }) {
  const url = `${SITE_URL}/challenges/${challenge._id}`;
  const cleanText = stripHtml(challenge.problemStatement || "");
  const today = new Date().toISOString().slice(0, 10);
  const dateModified = challenge.updatedAt || today;
  const datePublished = challenge.createdAt || dateModified;

  const teaches = [
    ...(challenge.topic || []),
    ...(challenge.keywords || []),
  ].filter(Boolean);

  const graph: Record<string, unknown>[] = [
    {
      "@type": ["LearningResource", "WebPage"],
      "@id": `${url}#webpage`,
      url,
      name: challenge.title,
      headline: challenge.title,
      description: truncate(cleanText, 300) || `Cybersecurity coding challenge: ${challenge.title}`,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      datePublished,
      dateModified,
      educationalLevel: challenge.difficulty || "Intermediate",
      educationalUse: "Practice",
      learningResourceType: "Coding challenge",
      teaches: teaches.length
        ? teaches.map((t) => ({ "@type": "DefinedTerm", name: t }))
        : undefined,
      audience: {
        "@type": "Audience",
        audienceType:
          "Detection engineers, blue team analysts, malware researchers, security engineers",
      },
      author: { "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      isAccessibleForFree: (challenge.paymentMode || "").toLowerCase() !== "paid",
      keywords: [
        challenge.title,
        ...(challenge.topic || []),
        ...(challenge.keywords || []),
      ]
        .filter(Boolean)
        .join(", "),
      mainEntity: { "@id": `${url}#challenge` },
    },
    {
      "@type": "Question",
      "@id": `${url}#challenge`,
      name: challenge.title,
      text: cleanText,
      answerCount: 0,
    },
    challenge.codeTemplate && {
      "@type": "SoftwareSourceCode",
      "@id": `${url}#starter`,
      name: `${challenge.title} — starter template`,
      programmingLanguage: ["C", "C++"],
      codeRepository: url,
      codeSampleType: "template",
      text: challenge.codeTemplate,
      isPartOf: { "@id": `${url}#webpage` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Challenges",
          item: `${SITE_URL}/challenges`,
        },
        { "@type": "ListItem", position: 3, name: challenge.title, item: url },
      ],
    },
  ].filter(Boolean) as Record<string, unknown>[];

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ q_id: string }>;
}) {
  const { q_id } = await params;
  const challenge = await fetchChallenge(q_id);

  if (!challenge) {
    // Public 404 — better than rendering an empty editor
    notFound();
  }

  const cleanStatement = stripHtml(challenge.problemStatement || "");
  const topics = (challenge.topic || []).filter(Boolean);
  const companies = (challenge.companies || []).filter(Boolean);
  const constraints = (challenge.constraints || []).filter(Boolean);

  return (
    <>
      <ChallengeJsonLd challenge={challenge} />

      {/* Server-rendered SEO/AEO shell — crawlable without JS */}
      <article className="sr-only" itemScope itemType="https://schema.org/LearningResource">
        <header>
          <nav aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/challenges">Challenges</Link>
              </li>
              <li aria-current="page">{challenge.title}</li>
            </ol>
          </nav>

          <h1 itemProp="name">{challenge.title}</h1>

          {challenge.difficulty && (
            <p>
              Difficulty:{" "}
              <span itemProp="educationalLevel">{challenge.difficulty}</span>
            </p>
          )}

          {topics.length > 0 && (
            <p>
              Topics:{" "}
              {topics.map((t, i) => (
                <span key={t}>
                  <span itemProp="about">{t}</span>
                  {i < topics.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          )}

          {companies.length > 0 && (
            <p>Companies: {companies.join(", ")}</p>
          )}
        </header>

        <section aria-labelledby="problem-heading">
          <h2 id="problem-heading">Problem statement</h2>
          <div itemProp="description">
            {cleanStatement
              .split(/\n{2,}|\.\s+(?=[A-Z])/)
              .filter((p) => p.trim())
              .map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
          </div>
        </section>

        {constraints.length > 0 && (
          <section aria-labelledby="constraints-heading">
            <h2 id="constraints-heading">Constraints</h2>
            <ul>
              {constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="howto-heading">
          <h2 id="howto-heading">How to solve this challenge</h2>
          <p>
            Open the in-browser IDE on this page, write your solution in C or
            C++, and click Run. A sandboxed agent compiles your code and
            executes it against the target while streaming live stdout, stderr,
            hook traces, and verification results over a WebSocket. When your
            implementation succeeds, the flag is surfaced automatically.
          </p>
        </section>

        <section aria-labelledby="audience-heading">
          <h2 id="audience-heading">Who is this challenge for?</h2>
          <p>
            Detection engineers, blue team analysts, malware researchers,
            security engineers, and operators who want hands-on practice with
            {topics.length > 0 ? ` ${topics.slice(0, 3).join(", ")}` : " API hooking, EDR detection, and adversary simulation"}.
          </p>
        </section>
      </article>

      <ChallengeEditor />
    </>
  );
}
