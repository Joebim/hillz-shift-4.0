/**
 * Formats phone number to WhatsApp format (international, no +, no spaces)
 * Examples: +234 806 123 4567 → 2348061234567
 */
const formatPhoneForWhatsApp = (phone: string): string => {
  // Remove all non-digit characters (spaces, +, -, etc.)
  const digitsOnly = phone.replace(/\D/g, "");
  // WhatsApp requires phone numbers to be at least 10 digits
  // Most international numbers are between 10-15 digits
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    console.warn(`Invalid phone number length: ${digitsOnly.length} digits`);
    return "";
  }
  return digitsOnly;
};

/**
 * Generates WhatsApp click-to-chat link with pre-filled message
 *
 * @param inviteeName - Name of the person being invited
 * @param inviterName - Name of the person sending the invite
 * @param customMessage - Custom message to include
 * @param registrationLink - Link to registration page
 * @param inviteePhone - Optional phone number in international format (with or without +)
 * @returns WhatsApp URL that opens chat with pre-filled message
 *
 * Format:
 * - With phone: https://wa.me/PHONE?text=MESSAGE
 * - Without phone: https://wa.me/?text=MESSAGE (opens WhatsApp Web/App)
 */
export const generateWhatsAppInvite = (
  inviteeName: string,
  inviterName: string,
  customMessage: string,
  registrationLink: string,
  inviteePhone?: string | null
): string => {
  // Format: friendly invitation message with custom message, names, and registration link
  const message = `*Hillz Shift 4.0 - A Personal Invitation*

${customMessage}

Hi ${inviteeName},

I hope this message finds you well! I wanted to personally invite you to join us for Hillz Shift 4.0, an incredible gathering where we'll explore deeper truths and experience spiritual transformation together.

This invitation comes from the heart, and I believe this event will be meaningful for you.

*You're Invited:*
${inviteeName}

*Invited By:*
${inviterName}

I would love to have you join us. Please register using the link below, and I'll be looking forward to seeing you there!

*Register Here:*
${registrationLink}

Can't wait to share this experience with you!

Blessings,
${inviterName}`;

  const encodedMessage = encodeURIComponent(message);

  // If phone number is provided, format it and include in URL
  if (inviteePhone && inviteePhone.trim()) {
    const formattedPhone = formatPhoneForWhatsApp(inviteePhone);
    if (formattedPhone && formattedPhone.length >= 10) {
      // WhatsApp click-to-chat format with phone number
      // This will open chat with specific contact on mobile, or WhatsApp Web on desktop
      return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    }
    console.warn(
      "Invalid phone number format, falling back to WhatsApp Web without specific contact"
    );
  }

  // Fallback: Open WhatsApp Web/App with pre-filled message (no specific contact)
  // User can manually select recipient
  return `https://wa.me/?text=${encodedMessage}`;
};
