import { resend, EMAIL_FROM } from "@/src/lib/email/transporter";
import {
  registrationTemplate,
  invitationTemplate,
} from "@/src/templates/email/invitationTemplate";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendEmail(
  {
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  },
  retryCount = 0
): Promise<unknown> {
  const maxRetries = 3;
  const retryDelay = 1000 * Math.pow(2, retryCount);

  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error(`❌ Invalid email address format: ${to}`);
      return null;
    }

    console.log(`📧 Attempting to send email via Resend to: ${to} (Attempt ${retryCount + 1}) | Subject: ${subject}`);
    
    // Check if resend is properly initialized
    if (!resend) {
      console.error("❌ Resend client is not initialized. Make sure RESEND_API_KEY is set.");
      return null;
    }

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'The Hillz Platform',
        'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN',
      },
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      
      // Resend specific rate limit or temporary server errors
      const isRetryableError = 
        error.name === 'rate_limit_exceeded' || 
        error.name === 'internal_server_error';

      if (isRetryableError && retryCount < maxRetries) {
        console.warn(`⚠️ Retryable Resend error detected. Retrying in ${retryDelay}ms...`);
        await delay(retryDelay);
        return sendEmail({ to, subject, html }, retryCount + 1);
      }
      return null;
    }

    console.log(`✅ Email sent successfully via Resend to: ${to}. Data:`, data);
    return data;
  } catch (error: unknown) {
    const err = error as { 
      code?: string; 
      message: string;
      name?: string;
    };

    const isRetryableError =
      err.code === 'ETIMEDOUT' ||
      err.code === 'ECONNRESET' ||
      err.code === 'ENOTFOUND' ||
      err.code === 'ESOCKET';

    if (isRetryableError && retryCount < maxRetries) {
      console.warn(`⚠️ Network timeout/error detected (${err.code}). Retrying in ${retryDelay}ms...`);
      await delay(retryDelay);
      return sendEmail({ to, subject, html }, retryCount + 1);
    }

    console.error("❌ Email send exception:", {
      code: err.code,
      name: err.name,
      to,
      subject,
      error: err.message
    });
    return null;
  }
}

export async function sendRegistrationEmail(
  to: string,
  userName: string,
  event: { 
    title: string; 
    date: string; 
    venue?: string;
    address?: string;
    bannerImage?: string;
    isMembershipForm?: boolean 
  },
  ticketCode: string,
  ticketUrl: string,
) {
  const html = registrationTemplate(
    userName,
    event.title,
    event.date,
    event.venue || "To be announced",
    event.address || "TBA",
    ticketCode,
    ticketUrl,
    event.bannerImage,
    event.isMembershipForm
  );

  await sendEmail({
    to,
    subject: event.isMembershipForm
      ? `Membership Confirmed: ${event.title}`
      : `Registration Confirmed: ${event.title}`,
    html,
  });
}

export async function sendInvitationEmail(
  to: string,
  inviteeName: string | undefined,
  inviterName: string,
  event: { 
    title: string; 
    date?: string;
    venue?: string;
    address?: string;
    bannerImage?: string;
    isMembershipForm?: boolean 
  },
  invitationCode: string,
  registerUrl: string,
  customMessage: string = "I thought you might be interested in this incredible gathering!"
) {
  const html = invitationTemplate(
    inviteeName || "Friend",
    inviterName,
    customMessage,
    `${registerUrl}?code=${invitationCode}`,
    event.title,
    event.bannerImage,
    event.isMembershipForm
  );

  await sendEmail({
    to,
    subject: event.isMembershipForm
      ? `${inviterName} invited you to join ${event.title}`
      : `${inviterName} invited you to ${event.title}`,
    html,
  });
}
