import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is missing. Emails will not be sent.");
}

export const resend = new Resend(RESEND_API_KEY);

console.log("📨 Resend Client Initialized");

export const EMAIL_FROM =
  process.env.EMAIL_FROM || '"The Hillz" <noreply@thehillz.org>';
