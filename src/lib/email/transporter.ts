import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "mail.thehillz.org";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === "true" || SMTP_PORT === 465;

if (!SMTP_USER || !SMTP_PASS) {
  console.warn(
    "⚠️ SMTP credentials (SMTP_USER/SMTP_PASS) are missing. Emails will not be sent.",
  );
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  '"The Hillz" <noreply@thehillz.org>';
