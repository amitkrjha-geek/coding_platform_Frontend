import { ImageResponse } from "next/og";

// Render on-demand instead of at build time.
// @vercel/og's bundled font loader uses fileURLToPath() which crashes on
// Windows project paths containing spaces (e.g. "D:\company project\...").
// Forcing dynamic skips the prerender pass entirely; the route is generated
// the first time it's requested.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const alt = "Violethat — Know Your Defense. Train Your Offense.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(ellipse 70% 60% at 20% 20%, rgba(168,85,247,0.20), transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(217,70,239,0.15), transparent 70%), #0B0F17",
          color: "#E6EDF7",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, rgba(168,85,247,0.8), transparent)",
          }}
        />

        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 10,
              border: "1px solid rgba(168,85,247,0.4)",
              background: "rgba(168,85,247,0.08)",
              color: "#A855F7",
              fontSize: 36,
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            V
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "#E6EDF7",
            }}
          >
            Vio<span style={{ color: "#A855F7" }}>_</span>ethat
          </div>
        </div>

        {/* Headline + sub */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 24,
              fontFamily: "monospace",
              color: "#A855F7",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            &gt; violethat
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "#E6EDF7",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Know Your Defense.</span>
            <span style={{ color: "#A855F7" }}>Train Your Offense.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#A4B1CD",
              maxWidth: 920,
              lineHeight: 1.4,
            }}
          >
            Hands-on cybersecurity training for detection engineers, blue
            teamers, and security researchers. Browser-native IDE. Live agent
            runner. Real flag capture.
          </div>
        </div>

        {/* Footer mono row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6B7A99",
            fontFamily: "monospace",
            fontSize: 20,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>violethat.com</span>
          <span>Compile · Run · Capture the flag</span>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
