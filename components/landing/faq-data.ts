/**
 * Single source of truth for the landing FAQ.
 * Imported by:
 *   - <LandingFAQ/>            (visible accordion)
 *   - <jsonld/FAQPage/>        (Phase L7 — structured data for AEO/GEO)
 *
 * The Q/A pairs MUST stay in sync between visible content and JSON-LD —
 * Google penalizes FAQ schema that doesn't mirror visible content.
 */

export interface FaqItem {
  question: string;
  /** Plain-text answer used in JSON-LD (no markup). Keep prose. */
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "What is Violethat?",
    answer:
      "Violethat is a hands-on cybersecurity training platform for detection engineers, blue teamers, malware analysts, and security researchers. You write C/C++ in a browser-based IDE, run a live agent against the target, and capture flags in real time — no setup, no VM, no install.",
  },
  {
    question: "Is it legal?",
    answer:
      "Yes. Every challenge runs inside an isolated execution environment controlled by Violethat. You only attack systems explicitly provided by us as practice targets — never any real-world infrastructure. The platform is built specifically for safe, sanctioned offensive and defensive training.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. The entire experience runs in your browser: a Monaco-based IDE for writing code, a remote agent runner that executes your code against the target, and a websocket stream that delivers logs back to you. No Docker, no VPN, no local toolchain.",
  },
  {
    question: "Will this prep me for OSCP or CPTS?",
    answer:
      "Yes. Pro tracks include certification-aligned challenges across Active Directory, web exploitation, privilege escalation, and post-exploitation. The platform also covers detection engineering and malware analysis, which complement offensive certifications by teaching you how attacks are seen from the defender side.",
  },
  {
    question: "How is Violethat different from HackTheBox or TryHackMe?",
    answer:
      "Three differences: (1) Violethat ships an in-browser C/C++ IDE — you write actual code instead of running pre-built tools, (2) a live agent runner streams real execution logs from inside the target, and (3) the platform is built detection-engineer-first, with Detect-DB research integrated into the challenge library. HTB and TryHackMe focus on guided box-pwning; Violethat focuses on build-and-break engineering.",
  },
  {
    question: "Can my company expense it?",
    answer:
      "Yes. Pro plans receive invoiced receipts that work with every major reimbursement system. Teams plans support annual invoicing, DPAs, SOC 2 questionnaire responses, and procurement-ready security documentation on request.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Monthly and annual Pro plans can be canceled from your billing dashboard at any time. You keep access until the end of your current billing period. No retention scripts, no calls.",
  },
  {
    question: "What languages and frameworks are supported?",
    answer:
      "The in-browser IDE currently supports C and C++ with full syntax highlighting, formatting, and a real compiler. Additional language support — including C#, Python, Rust, and Go — is on the roadmap and will be announced via the changelog.",
  },
];
