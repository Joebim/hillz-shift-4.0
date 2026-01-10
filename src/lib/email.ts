import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use SMTP settings from env
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"Hillz Shift 4.0" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true, info };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
};
