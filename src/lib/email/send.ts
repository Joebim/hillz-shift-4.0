import { transporter, EMAIL_FROM } from "@/src/lib/email/transporter";
import {
  getRegistrationEmail,
  getInvitationEmail,
} from "@/src/lib/email/templates";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("Email send error:", error);
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
