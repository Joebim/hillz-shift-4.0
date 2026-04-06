import { transporter, EMAIL_FROM } from "@/src/lib/email/transporter";
import {
  getRegistrationEmail,
  getInvitationEmail,
} from "@/src/lib/email/templates";

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

    console.log(`📧 Attempting to send email to: ${to} (Attempt ${retryCount + 1}) | Subject: ${subject}`);
    
    const info = await transporter.sendMail({
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

    console.log(`✅ Email sent successfully to: ${to}. MessageId: ${info.messageId}`);
    return info;
  } catch (error: unknown) {
    const err = error as { 
      code?: string; 
      responseCode?: number; 
      response?: string; 
      command?: string; 
      message: string;
    };

    const isRetryableError =
      err.responseCode === 450 ||
      err.code === 'ETIMEDOUT' ||
      err.code === 'ECONNRESET' ||
      err.code === 'ENOTFOUND' ||
      err.code === 'ESOCKET';

    if (isRetryableError && retryCount < maxRetries) {
      console.warn(`⚠️ Retryable error detected (${err.code}). Retrying in ${retryDelay}ms...`);
      await delay(retryDelay);
      return sendEmail({ to, subject, html }, retryCount + 1);
    }

    console.error("❌ Email send error details:", {
      code: err.code,
      responseCode: err.responseCode,
      response: err.response,
      command: err.command,
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
  event: { title: string; date: string; isMembershipForm?: boolean },
  ticketCode: string,
  ticketUrl: string,
) {
  const html = getRegistrationEmail(
    userName,
    event.title,
    event.date,
    ticketCode,
    ticketUrl,
    event.isMembershipForm,
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
  event: { title: string; isMembershipForm?: boolean },
  invitationCode: string,
  registerUrl: string,
) {
  const html = getInvitationEmail(
    inviteeName,
    inviterName,
    event.title,
    invitationCode,
    registerUrl,
    event.isMembershipForm,
  );
  await sendEmail({
    to,
    subject: event.isMembershipForm
      ? `${inviterName} invited you to join ${event.title}`
      : `${inviterName} invited you to ${event.title}`,
    html,
  });
}
