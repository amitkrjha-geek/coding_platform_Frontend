// Twitter card mirrors the OG image (same dimensions / treatment).
// Route-segment config (dynamic, runtime, alt, size, contentType) MUST be
// declared inline — Next.js does not follow re-exports for these values.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export { default, alt, size, contentType } from "./opengraph-image";
