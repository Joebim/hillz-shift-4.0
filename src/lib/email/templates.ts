interface EmailTemplateProps {
  title: string;
  body: string;
  action?: {
    label: string;
    url: string;
  };
  footer?: string;
}

const baseTemplate = ({ title, body, action, footer }: EmailTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #6B46C1; margin-bottom: 20px; }
    .header h1 { color: #6B46C1; margin: 0; font-size: 24px; }
    .content { padding: 0 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #6B46C1; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; text-align: center; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${body}
      ${action ? `<div style="text-align: center;"><a href="${action.url}" class="button">${action.label}</a></div>` : ""}
    </div>
    <div class="footer">
      ${footer || "© 2024 Ministry Platform. All rights reserved."}
    </div>
  </div>
</body>
</html>
`;

export const getRegistrationEmail = (
  userName: string,
  eventName: string,
  eventDate: string,
  ticketCode: string,
  ticketUrl: string,
  isMembership?: boolean,
) => {
  return baseTemplate({
    title: isMembership ? "Membership Form Received! 📋" : "Registration Confirmed! 🎉",
    body: `
      <p>Hi ${userName},</p>
      <p>${isMembership 
        ? `We have successfully received your membership form for <strong>${eventName}</strong>.` 
        : `You are officially registered for <strong>${eventName}</strong>.`}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Your ${isMembership ? "Reference" : "Ticket"} Code:</strong> <code style="background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 1.2em;">${ticketCode}</code></p>
      <p>${isMembership 
        ? "We look forward to having you as part of our community. Please keep this code for your records."
        : "Please present this code or the QR code at the entrance."}</p>
    `,
    action: {
      label: isMembership ? "View My Details" : "View My Ticket",
      url: ticketUrl,
    },
    footer: isMembership
      ? "If you have any questions, please reach out to us."
      : "Can't make it? Please let us know so we can give your spot to someone else.",
  });
};

export const getInvitationEmail = (
  inviteeName: string | undefined,
  inviterName: string,
  eventName: string,
  invitationCode: string,
  registerUrl: string,
  isMembership?: boolean,
) => {
  return baseTemplate({
    title: isMembership ? "Join Our Community! 🤝" : "You're Invited! 🌟",
    body: `
      <p>Hi ${inviteeName || "Friend"},</p>
      <p><strong>${inviterName}</strong> has invited you to ${isMembership ? "become a member of" : "join them at"} <strong>${eventName}</strong>.</p>
      <p>${isMembership 
        ? "We would be honored to have you as part of our growing community! Use the link below to fill out the form." 
        : "We would love to see you there! Use the code below to secure your spot."}</p>
      <p><strong>${isMembership ? "Reference" : "Invitation"} Code:</strong> <code style="background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 1.2em;">${invitationCode}</code></p>
    `,
    action: {
      label: isMembership ? "Complete Membership Form" : "Register Now",
      url: `${registerUrl}?code=${invitationCode}`,
    },
  });
};
