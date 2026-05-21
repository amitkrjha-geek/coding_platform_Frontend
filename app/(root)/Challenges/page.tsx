import type { Metadata } from "next";
import Link from "next/link";
import Challenges from "@/components/home/Challenges";
import { SITE_URL } from "@/components/landing/pricing-data";

const TITLE =
  "Cybersecurity Coding Challenges — EDR, Hooking & Detection Engineering Labs";
const DESCRIPTION =
  "Browse hands-on cybersecurity coding challenges covering API hooking, EDR detection, malware analysis, syscall instrumentation, and adversary simulation. Write C and C++ in the browser, run a sandboxed agent against the target, and capture flags in real time.";
const URL = `${SITE_URL}/challenges`;

// Revalidate the SSR list every 10 minutes — fresh enough for new challenges
// to appear in search, cheap enough to keep TTFB low.
export const revalidate = 600;

interface SsrChallenge {
  _id: string;
  title: string;
  difficulty?: string;
  topic?: string[];
  problemStatement?: string;
  paymentMode?: string;
}

async function fetchChallengesServerSide(): Promise<SsrChallenge[]> {
  const base = process.env.NEXT_PUBLIC_API_END_POINTS;
  if (!base) return [];
  try {
    const res = await fetch(`${base}/api/challenges`, {
      next: { revalidate: 600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // API may return either an array directly or { data: [...] } — handle both
    const list: unknown = Array.isArray(data) ? data : data?.data;
    if (!Array.isArray(list)) return [];
    return list as SsrChallenge[];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/challenges" },
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
  keywords: [
    "cybersecurity coding challenges",
    "EDR detection engineering labs",
    "API hooking practice",
    "malware analysis challenges",
    "Frida challenges",
    "Detours challenges",
    "syscall instrumentation labs",
    "blue team coding practice",
    "detection engineer training",
    "CTF detection challenges",
    "Violethat challenges",
  ],
  openGraph: {
    type: "website",
    url: "/challenges",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Violethat",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

function ChallengesJsonLd({ challenges }: { challenges: SsrChallenge[] }) {
  const today = new Date().toISOString().slice(0, 10);

  const itemListElements = challenges.slice(0, 100).map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/challenges/${c._id}`,
    name: c.title,
  }));

  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      "@id": `${URL}#webpage`,
      url: URL,
      name: TITLE,
      description: DESCRIPTION,
      datePublished: "2024-06-01",
      dateModified: today,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      audience: {
        "@type": "Audience",
        audienceType:
          "Detection engineers, blue team analysts, malware researchers, security engineers",
      },
      mainEntity: { "@id": `${URL}#itemlist` },
    },
    {
      "@type": "ItemList",
      "@id": `${URL}#itemlist`,
      name: "Violethat cybersecurity coding challenges",
      description:
        "Hands-on coding challenges spanning EDR detection, API hooking, malware analysis, and adversary simulation.",
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: challenges.length,
      itemListElement: itemListElements,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Challenges", item: URL },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What are Violethat coding challenges?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Violethat challenges are hands-on cybersecurity coding labs focused on Endpoint Detection Engineering. Each challenge gives you a target to attack or instrument, a browser-based C and C++ IDE to write your code, and a sandboxed agent that executes your build and streams live results until you capture the flag.",
          },
        },
        {
          "@type": "Question",
          name: "Who are these challenges for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Detection engineers, blue team analysts, malware researchers, security engineers, and operators who want to practice API hooking, syscall instrumentation, EDR detection, and adversary simulation against real binaries instead of slides.",
          },
        },
        {
          "@type": "Question",
          name: "What languages and tools do I need?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "C and C++ inside the in-browser IDE. No local setup required. The sandboxed agent supports multiple instrumentation packages for hooking and API monitoring, and streams stdout, stderr, and verification results back to you over a WebSocket.",
          },
        },
        {
          "@type": "Question",
          name: "Are the challenges free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You get free access to a starter set of challenges with the in-browser IDE and live agent runner. Premium challenges with full writeups and reference solutions are available under our subscription and per-challenge plans.",
          },
        },
      ],
    },
  ];
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

export default async function ChallengesPage() {
  const challenges = await fetchChallengesServerSide();

  return (
    <main>
      <ChallengesJsonLd challenges={challenges} />

      {/* Server-rendered SEO/AEO header — crawlable without JS */}
      <header className="sr-only">
        <h1>
          Cybersecurity coding challenges — EDR, hooking, and detection
          engineering labs
        </h1>
        <p>{DESCRIPTION}</p>

        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">Challenges</li>
          </ol>
        </nav>

        <section aria-labelledby="what-heading">
          <h2 id="what-heading">What are Violethat challenges?</h2>
          <p>
            Each challenge is a hands-on coding lab that targets a real
            detection-engineering or adversary-simulation skill. You write C or
            C++ in the browser-native IDE, a sandboxed agent compiles and runs
            your code against the target, and live agent telemetry streams
            stdout, stderr, hook traces, and verification results back to you
            over a WebSocket. When your implementation succeeds, the flag is
            surfaced automatically — no manual submission required.
          </p>
        </section>

        <section aria-labelledby="topics-heading">
          <h2 id="topics-heading">Topics covered</h2>
          <ul>
            <li>API hooking and inline detours</li>
            <li>Syscall instrumentation and tracing</li>
            <li>EDR detection and bypass research</li>
            <li>Malware analysis and reverse engineering</li>
            <li>Adversary simulation and red-team tradecraft</li>
            <li>AI security and adversarial ML</li>
            <li>Process injection and memory forensics</li>
          </ul>
        </section>

        <section aria-labelledby="audience-heading">
          <h2 id="audience-heading">Who is this for?</h2>
          <p>
            Detection engineers, blue team analysts, malware researchers,
            security engineers, and operators who want to practice the
            techniques real attackers use — and write the detections that
            catch them — in a sandboxed environment built for the work, not the
            demo.
          </p>
        </section>

        {/* SSR list — every challenge name + URL crawlable without JS */}
        {challenges.length > 0 && (
          <section aria-labelledby="all-challenges-heading">
            <h2 id="all-challenges-heading">
              All challenges ({challenges.length})
            </h2>
            <ul>
              {challenges.map((c) => {
                const desc =
                  (c.problemStatement || "")
                    .replace(/<[^>]+>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()
                    .slice(0, 160);
                const topics = (c.topic || []).filter(Boolean).join(", ");
                return (
                  <li key={c._id}>
                    <Link href={`/challenges/${c._id}`}>{c.title}</Link>
                    {c.difficulty && <span> — {c.difficulty}</span>}
                    {topics && <span> — Topics: {topics}</span>}
                    {desc && <p>{desc}</p>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </header>

      <Challenges />
    </main>
  );
}
