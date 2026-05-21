import type { Metadata } from "next";
import VsHero from "@/components/landing/compare/VsHero";
import VsTable, { type VsRow } from "@/components/landing/compare/VsTable";
import VsVerdict from "@/components/landing/compare/VsVerdict";
import FinalCTA from "@/components/landing/FinalCTA";
import VsJsonLd from "@/components/landing/jsonld/VsJsonLd";

const TITLE = "Violethat vs HackTheBox — Honest comparison";
const DESCRIPTION =
  "Side-by-side comparison of Violethat and HackTheBox for hands-on cybersecurity training. Browser-native IDE, live agent runner, detection-engineering focus — vs HackTheBox's guided box-pwning model.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/vs/hackthebox" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/vs/hackthebox",
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const rows: VsRow[] = [
  { feature: "Free tier", ours: "yes", theirs: "partial" },
  {
    feature: "Starting paid price",
    ours: "₹719/mo (annual)",
    theirs: "$20/mo",
  },
  {
    feature: "In-browser IDE (C/C++)",
    ours: "yes",
    theirs: "no",
    emphasis: true,
  },
  {
    feature: "Live agent runner + streaming logs",
    ours: "yes",
    theirs: "no",
    emphasis: true,
  },
  {
    feature: "Detection-engineering focus",
    ours: "yes",
    theirs: "partial",
    emphasis: true,
  },
  { feature: "Guided pwn machines", ours: "partial", theirs: "yes" },
  { feature: "OSCP / CPTS prep tracks", ours: "yes", theirs: "yes" },
  { feature: "Active Directory labs", ours: "yes", theirs: "yes" },
  {
    feature: "Zero-install (no VPN, no VM)",
    ours: "yes",
    theirs: "no",
    emphasis: true,
  },
  { feature: "Team / enterprise plans", ours: "yes", theirs: "yes" },
];

const whenViolethat = [
  {
    heading: "You're a detection engineer or blue teamer",
    body: "Violethat ships challenges built around real adversary TTPs you can write detection logic against — and Detect-DB research is baked in.",
  },
  {
    heading: "You want to write code, not just run tools",
    body: "Our browser-native C/C++ IDE plus a live agent runner means you build and execute the exploit yourself. HackTheBox is mostly tool-driven box-pwning.",
  },
  {
    heading: "You hate setup overhead",
    body: "No VPN config, no VM downloads, no Pwnbox subscription. Open the tab, click Run, watch the logs.",
  },
];

const whenHTB = [
  {
    heading: "You want the biggest pwn-style catalog",
    body: "HackTheBox has the largest catalog of guided machines and prepared retired-box writeups in the industry.",
  },
  {
    heading: "You're chasing the HTB-specific rank ladder",
    body: "If your team or community runs on HackTheBox ranks (Pro Hacker, Elite, Guru, Omniscient), staying on the same platform makes social sense.",
  },
  {
    heading: "You're doing Active Directory at competition scale",
    body: "HackTheBox's Pro Labs (Dante, Offshore, Cybernetics) remain the de-facto multi-machine AD playground.",
  },
];

const pageFaqs = [
  {
    question: "Is Violethat a HackTheBox clone?",
    answer:
      "No. HackTheBox focuses on guided machine pwning with prepared tooling. Violethat ships a browser-based C/C++ IDE plus a live agent runner — you write the exploit code yourself and watch every hook and syscall stream back in real time. The two platforms solve different parts of the training problem.",
  },
  {
    question: "Can I use Violethat to prep for OSCP / CPTS?",
    answer:
      "Yes. Pro tracks include certification-aligned challenges across Active Directory, web exploitation, privilege escalation, and post-exploitation. Violethat also covers detection engineering and malware analysis, which complement offensive certifications.",
  },
  {
    question: "Is Violethat cheaper than HackTheBox?",
    answer:
      "Pricing depends on cadence and currency, but Violethat's annual Pro plan is positioned to be more affordable than HTB's VIP+ tier for individual learners in INR. Teams pricing is custom for both.",
  },
];

export default function VsHackTheBoxPage() {
  return (
    <>
      <VsJsonLd
        competitor="HackTheBox"
        path="/vs/hackthebox"
        title={TITLE}
        description={DESCRIPTION}
        datePublished="2026-01-01"
        faqs={pageFaqs}
      />
      <VsHero
        competitor="HackTheBox"
        sub="An honest, side-by-side look at the two platforms — where each one shines, where it stops, and which fits your workflow."
      />
      <VsTable
        competitor="HackTheBox"
        rows={rows}
        heading="Violethat vs HackTheBox at a glance"
      />
      <VsVerdict
        competitor="HackTheBox"
        whenViolethat={whenViolethat}
        whenCompetitor={whenHTB}
      />
      <FinalCTA />
    </>
  );
}
