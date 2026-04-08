import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

let resendInstance: Resend | null = null;

export const getResend = () => {
  if (!resendInstance && RESEND_API_KEY) {
    resendInstance = new Resend(RESEND_API_KEY);
  }
  return resendInstance;
};

// For backward compatibility, keep the old export but initialize safely
export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : (null as any);

console.log("📨 Resend Client Initialized");

export const EMAIL_FROM =
  process.env.EMAIL_FROM || '"The Hillz" <noreply@thehillz.org>';

