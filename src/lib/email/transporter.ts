import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === "true";

if (!SMTP_USER || !SMTP_PASS) {
  console.warn(
    "⚠️ SMTP credentials (SMTP_USER/SMTP_PASS) are missing. Emails will not be sent.",
  );
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  '"Ministry Platform" <noreply@ministryplatform.com>';
