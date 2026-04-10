
const formatPhoneForWhatsApp = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return "";
  }
  return digitsOnly;
};

export const generateWhatsAppInvite = (
  inviteeName: string,
  inviterName: string,
  customMessage: string,
  registrationLink: string,
  inviteePhone?: string | null,
  eventTitle: string = "Shift 4.0"
): string => {
  const message = `*${eventTitle} - A Personal Invitation*

Hi ${inviteeName},

${customMessage || "I'm personally inviting you to join us for this life-changing encounter."}

This is a special invitation. Come expecting clarity, fellowship and an unveiling of Christ.

*You're Invited:*
${inviteeName}

*Invited By:*
${inviterName}

Please register using the link below,

*Register Here:*
${registrationLink}

Looking forward to seeing you at ${eventTitle}!`;

  const encodedMessage = encodeURIComponent(message);

  if (inviteePhone && inviteePhone.trim()) {
    const formattedPhone = formatPhoneForWhatsApp(inviteePhone);
    if (formattedPhone && formattedPhone.length >= 10) {
      return `https://wa.me/${formattedPhone}/?text=${encodedMessage}`;
    }
    console.warn(
      "Invalid phone number format, falling back to WhatsApp Web without specific contact"
    );
  }

  return `https://wa.me/?text=${encodedMessage}`;
};
