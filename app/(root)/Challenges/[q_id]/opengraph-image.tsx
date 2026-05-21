import { ImageResponse } from "next/og";

// Render on-demand — see app/opengraph-image.tsx for the full reason
// (@vercel/og font loader crashes on Windows paths with spaces at build time).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const alt = "Violethat — cybersecurity coding challenge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface ChallengeShape {
  _id: string;
  title?: string;
  difficulty?: string;
  topic?: string[];
  paymentMode?: string;
}

async function fetchChallenge(id: string): Promise<ChallengeShape | null> {
  const base = process.env.NEXT_PUBLIC_API_END_POINTS;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/challenges/${id}`, {
      next: { revalidate: 600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const c: unknown =
      data && typeof data === "object" && "data" in data ? data.data : data;
    if (!c || typeof c !== "object") return null;
    return c as ChallengeShape;
  } catch {
    return null;
  }
}

function difficultyTint(difficulty?: string) {
  const d = (difficulty || "").toLowerCase();
  if (d.includes("easy")) return { fg: "#7ee787", bg: "rgba(126,231,135,0.12)" };
  if (d.includes("med") || d.includes("intermediate"))
    return { fg: "#f0b429", bg: "rgba(240,180,41,0.12)" };
  if (d.includes("hard") || d.includes("advanced") || d.includes("expert"))
    return { fg: "#ff7b72", bg: "rgba(255,123,114,0.12)" };
  return { fg: "#c4b5fd", bg: "rgba(196,181,253,0.12)" };
}

export default async function ChallengeOgImage({
  params,
}: {
  params: { q_id: string };
}) {
  const c = await fetchChallenge(params.q_id);
  const title = c?.title || "Cybersecurity Coding Challenge";
  const difficulty = c?.difficulty;
  const topics = (c?.topic || []).filter(Boolean).slice(0, 3);
  const isPaid = (c?.paymentMode || "").toLowerCase() === "paid";
  const dTint = difficultyTint(difficulty);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(217,70,239,0.18), transparent 50%), #0b0d12",
          color: "#e6edf3",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto",
          position: "relative",
        }}
      >
        {/* Grid texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(168,85,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #a855f7, #d946ef, #a855f7, transparent)",
          }}
        />

        {/* Top row: brand + eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                border: "1px solid rgba(168,85,247,0.35)",
                background: "rgba(168,85,247,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#c4b5fd",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              {">_"}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                Vio<span style={{ color: "#a855f7" }}>_</span>ethat
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(230,237,243,0.55)",
                  marginTop: 2,
                }}
              >
                challenge.detail
              </div>
            </div>
          </div>

          {isPaid && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid rgba(217,70,239,0.45)",
                background:
                  "linear-gradient(90deg, rgba(168,85,247,0.18), rgba(217,70,239,0.18))",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#f5d0fe",
                fontWeight: 700,
              }}
            >
              Premium
            </div>
          )}
        </div>

        {/* Middle: title block */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
          {difficulty && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 12px",
                borderRadius: 4,
                border: `1px solid ${dTint.fg}55`,
                background: dTint.bg,
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 13,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: dTint.fg,
                fontWeight: 700,
                alignSelf: "flex-start",
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: dTint.fg,
                }}
              />
              {difficulty}
            </div>
          )}

          <div
            style={{
              fontSize: title.length > 70 ? 52 : title.length > 40 ? 64 : 76,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              maxWidth: 1050,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: topics + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {topics.map((t) => (
              <div
                key={t}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "1px solid rgba(168,85,247,0.3)",
                  background: "rgba(168,85,247,0.08)",
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  fontSize: 14,
                  color: "#c4b5fd",
                }}
              >
                {t}
              </div>
            ))}
          </div>

          <div
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontSize: 14,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(230,237,243,0.55)",
            }}
          >
            violethat.com/challenges
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
