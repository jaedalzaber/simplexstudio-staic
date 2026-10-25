import { z } from "zod";

export const contactSchema = z.strictObject({
  name: z.string().trim().min(2, "Enter your name.").max(100, "Use 100 characters or fewer."),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email("Enter a valid email address.")),
  company: z.string().trim().max(160, "Use 160 characters or fewer.").optional().default(""),
  message: z.string().trim().min(10, "Use at least 10 characters.").max(5000, "Use 5,000 characters or fewer."),
  // The visitor asked for a non-disclosure agreement before sharing details.
  nda: z.boolean().optional().default(false),
  // Honeypot: the contact form hides this from people and autofill; leave it empty.
  website: z.string().max(200).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactSubmission = z.output<typeof contactSchema>;
export type ContactFieldErrors = Partial<Record<keyof ContactSubmission, string[]>>;
export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: ContactFieldErrors };
