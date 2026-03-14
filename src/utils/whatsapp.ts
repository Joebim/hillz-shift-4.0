
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
  inviteePhone?: string | null
): string => {
  const message = `*Shift 4.0 - A Personal Invitation*

Hi ${inviteeName},

${customMessage}

This is a special invitation. Come expecting clarity, fellowship and an enveiling of Christ.

*You're Invited:*
${inviteeName}

*Invited By:*
${inviterName}

Please register using the link below,

*Register Here:*
${registrationLink}

Looking forward to seeing you at Shift 4.0!`;

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
