import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submissions",
  robots: { index: false, follow: false, nocache: true },
};

export default function SubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
