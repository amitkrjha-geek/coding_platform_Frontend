import type { Metadata } from "next";
import VsHero from "@/components/landing/compare/VsHero";
import VsTable, { type VsRow } from "@/components/landing/compare/VsTable";
import VsVerdict from "@/components/landing/compare/VsVerdict";
import FinalCTA from "@/components/landing/FinalCTA";
import VsJsonLd from "@/components/landing/jsonld/VsJsonLd";

const TITLE = "Violethat vs TryHackMe — Honest comparison";
const DESCRIPTION =
  "Side-by-side comparison of Violethat and TryHackMe for hands-on cybersecurity training. Browser-native C/C++ IDE, live agent runner, detection-engineering focus — vs TryHackMe's guided room model.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/vs/tryhackme" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/vs/tryhackme",
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const rows: VsRow[] = [
  { feature: "Free tier", ours: "yes", theirs: "yes" },
  {
    feature: "Starting paid price",
    ours: "₹719/mo (annual)",
    theirs: "$14/mo",
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
  { feature: "Beginner-friendly tracks", ours: "yes", theirs: "yes" },
  { feature: "Guided room model", ours: "partial", theirs: "yes" },
  { feature: "Malware analysis / C-level labs", ours: "yes", theirs: "partial" },
  {
    feature: "Zero-install (no VPN, no VM)",
    ours: "yes",
    theirs: "partial",
    emphasis: true,
  },
  { feature: "Team / enterprise plans", ours: "yes", theirs: "yes" },
];

const whenViolethat = [
  {
    heading: "You've outgrown 'follow the room' learning",
    body: "TryHackMe is excellent for hand-held intros. Once you want to write the exploit yourself in C/C++ and watch the agent execute it, Violethat is the next step.",
  },
  {
    heading: "You work in detection, not just red-team",
    body: "Violethat is built detection-engineer-first, with Detect-DB research integrated into the challenge library — TryHackMe leans offensive.",
  },
  {
    heading: "You want to skip the install friction entirely",
    body: "No browser-VPN setup, no Attack Box minutes to ration. Open the tab, click Run.",
  },
];

const whenThm = [
  {
    heading: "You're brand new to cybersecurity",
    body: "TryHackMe's guided rooms and learning paths are the friendliest on-ramp in the industry for absolute beginners.",
  },
  {
    heading: "You want structured learning paths with badges",
    body: "TryHackMe's pre-built paths (Pre Security, Jr Penetration Tester, SOC Level 1, etc.) work well if you prefer following a curriculum.",
  },
  {
    heading: "Your community / classroom already uses it",
    body: "TryHackMe is widely adopted in academic settings and security clubs. If your cohort is already there, the social proof matters.",
  },
];

const pageFaqs = [
  {
    question: "Is Violethat just TryHackMe for advanced users?",
    answer:
      "Not exactly. The two platforms have different shapes. TryHackMe is best-in-class for guided learning paths. Violethat ships an in-browser C/C++ IDE plus a live agent runner — you write the exploit code yourself and see every hook and syscall stream back in real time. We attract intermediate-to-advanced learners and detection practitioners.",
  },
  {
    question: "Can I migrate my TryHackMe progress?",
    answer:
      "There is no formal migration since the platforms work differently — Violethat doesn't track room completions, it tracks flag captures and skill matrices. You can start fresh with the free tier and use our challenge difficulty mapping to find content equivalent to where you are.",
  },
  {
    question: "Does Violethat have a SOC analyst track like TryHackMe?",
    answer:
      "Yes. Detection-engineering challenges and SOC-Level skills are central to our catalog — much of the legacy Detect-DB research is now wrapped as challenges. We complement (rather than copy) TryHackMe's SOC Level 1/2 paths.",
  },
];

export default function VsTryHackMePage() {
  return (
    <>
      <VsJsonLd
        competitor="TryHackMe"
        path="/vs/tryhackme"
        title={TITLE}
        description={DESCRIPTION}
        datePublished="2026-01-01"
        faqs={pageFaqs}
      />
      <VsHero
        competitor="TryHackMe"
        sub="An honest, side-by-side look at the two platforms — where each one shines, where it stops, and which fits your workflow."
      />
      <VsTable
        competitor="TryHackMe"
        rows={rows}
        heading="Violethat vs TryHackMe at a glance"
      />
      <VsVerdict
        competitor="TryHackMe"
        whenViolethat={whenViolethat}
        whenCompetitor={whenThm}
      />
      <FinalCTA />
    </>
  );
}
