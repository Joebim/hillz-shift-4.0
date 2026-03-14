import nodemailer from "nodemailer";

type EmailLogContext = {
  requestId?: string;
  purpose?: "registration_confirmation" | "invitation" | "other";
};

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "***";
  const maskedUser =
    user.length <= 2 ? `${user[0] || "*"}*` : `${user.slice(0, 2)}***`;
  return `${maskedUser}@${domain}`;
}

function getEmailConfig() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  return { user, pass };
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export const sendEmail = async ({
  to,
  subject,
  html,
  context,
}: {
  to: string;
  subject: string;
  html: string;
  context?: EmailLogContext;
}) => {
  const { user, pass } = getEmailConfig();
  const requestId = context?.requestId;

  if (!user || !pass) {
    console.error("EMAIL_CONFIG_MISSING", {
      requestId,
      hasEmailUser: Boolean(user),
      hasEmailPass: Boolean(pass),
      to: maskEmail(to),
      subject,
      purpose: context?.purpose,
    });
    return { success: false, error: new Error("EMAIL_CONFIG_MISSING") };
  }

  const transporter = createTransporter();

  try {
    console.log("SENDING_EMAIL", {
      requestId,
      from: maskEmail(user),
      to: maskEmail(to),
      subject,
      purpose: context?.purpose,
      provider: "gmail",
    });

    const info = await transporter.sendMail({
      from: `"Hillz Conference" <${user}>`,
      to,
      subject,
      html,
    });

    console.log("EMAIL_SENT", {
      requestId,
      messageId: info.messageId,
      accepted: info.accepted?.length ?? 0,
      rejected: info.rejected?.length ?? 0,
      response: info.response,
    });
    return { success: true, info };
  } catch (error) {
    const err = error as Record<string, unknown>;
    console.error("EMAIL_SEND_FAILED", {
      requestId,
      to: maskEmail(to),
      subject,
      purpose: context?.purpose,
      name: err?.name,
      message: err?.message,
      code: err?.code,
      command: err?.command,
      responseCode: err?.responseCode,
      response: err?.response,
    });
    if (
      err?.message &&
      String(err.message).toLowerCase().includes("invalid login")
    ) {
      console.warn("EMAIL_LOGIN_HINT", {
        requestId,
        hint: "Use a Gmail App Password (2-step verification) instead of account password.",
      });
    }
    return { success: false, error };
  }
};
