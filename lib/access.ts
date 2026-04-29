export const getAllowedEmails = (): string[] =>
  (process.env.NEXT_PUBLIC_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isEmailAllowed = (email?: string | null) =>
  !!email && getAllowedEmails().includes(email.toLowerCase());
