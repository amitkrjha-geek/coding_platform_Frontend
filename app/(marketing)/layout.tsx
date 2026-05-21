import MarketingNav from "@/components/landing/MarketingNav";
// import MarketingFooter from "@/components/landing/MarketingFooter";

/**
 * Layout for marketing routes (comparison pages, about, future docs/blog).
 *
 * Each marketing page automatically gets:
 *   - Skip-to-content link (a11y, first focusable element)
 *   - <MarketingNav/> (auth-aware sticky nav)
 *   - <MarketingFooter/>
 *
 * The landing page (app/page.tsx) lives OUTSIDE this group because it has
 * its own JSON-LD <SiteJsonLd/> at the very top of the component tree.
 *
 * The global app <Navbar/> in app/layout.tsx hides itself on these routes
 * via path-based logic; we add `/vs/` and `/about` to that check below.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-neon focus:text-white focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Skip to content
      </a>
      <MarketingNav />
      <main id="main" className="bg-htb-bg">
        {children}
      </main>
      {/* <MarketingFooter /> */}
    </>
  );
}
