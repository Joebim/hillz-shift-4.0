import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === "true";

export const getTransporter = () => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not set in environment variables");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE, // true for port 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Ensure custom/self-signed certs are supported
    },
  });
};

const FROM_NAME = process.env.EMAIL_FROM || "The Hillz";
export const EMAIL_FROM = `"${FROM_NAME}" <${SMTP_USER || "noreply@thehillz.org"}>`;
