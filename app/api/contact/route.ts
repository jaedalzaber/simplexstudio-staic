import { siteConfig } from "@/config/site";
import { createContactHandler } from "@/lib/contact/handler";
import { saveContactSubmission } from "@/lib/server/contact-repository";

export const POST = createContactHandler({
  allowedOrigin: process.env.SITE_URL ? siteConfig.url : undefined,
  persist: saveContactSubmission,
  onError: () => console.error("Contact submission could not be saved; check server configuration and database connectivity."),
});
