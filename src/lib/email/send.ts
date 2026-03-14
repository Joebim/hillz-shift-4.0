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
    
    return null;
  }
}

export async function sendRegistrationEmail(
  to: string,
  userName: string,
  event: { title: string; date: string },
  ticketCode: string,
  ticketUrl: string,
) {
  const html = getRegistrationEmail(
    userName,
    event.title,
    event.date,
    ticketCode,
    ticketUrl,
  );
  await sendEmail({
    to,
    subject: `You're going to ${event.title}!`,
    html,
  });
}

export async function sendInvitationEmail(
  to: string,
  inviteeName: string | undefined,
  inviterName: string,
  eventName: string,
  invitationCode: string,
  registerUrl: string,
) {
  const html = getInvitationEmail(
    inviteeName,
    inviterName,
    eventName,
    invitationCode,
    registerUrl,
  );
  await sendEmail({
    to,
    subject: `${inviterName} invited you to ${eventName}`,
    html,
  });
}
