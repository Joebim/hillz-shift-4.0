import { createDocument, queryDocuments } from "./firebase/firestore";
import { sendEmail } from "./email/send";
import { User } from "../types/user";

export async function createAdminNotification(data: {
  type: string;
  actorName: string;
  action: string;
  highlight: string;
  suffix?: string;
  eventTitle?: string;
  eventId?: string;
}) {
  // 1. Create the notification document in Firestore
  const notificationId = await createDocument("notifications", {
    ...data,
    read: false,
    createdAt: new Date(),
  });

  // 2. Fetch all super_admin and admin users
  try {
    const admins = await queryDocuments<User>("users");
    const adminUsers = admins.filter(
      (u) =>
        u.active &&
        (u.role === "super_admin" || u.role === "admin")
    );
    const recipientEmails = adminUsers.map((u) => u.email).filter(Boolean);

    // If there are admin emails, send the email
    if (recipientEmails.length > 0) {
      const subject = `[Hillz Platform] New Activity: ${data.actorName} ${data.action} ${data.highlight}`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fcfcfc;">
          <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; margin-top: 0;">New Platform Activity</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            <strong>${data.actorName}</strong> ${data.action} <span style="color: #7c3aed; font-weight: bold;">${data.highlight}</span>${data.suffix ? " " + data.suffix : ""}${data.eventTitle ? ' for event "' + data.eventTitle + '"' : ""}.
          </p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #555;">
            <strong>Notification Details:</strong>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; line-height: 1.5;">
              <li><strong>Type:</strong> ${data.type}</li>
              <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Please log in to the <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin" style="color: #7c3aed; text-decoration: none; font-weight: bold;">Admin Dashboard</a> to review.
          </p>
        </div>
      `;

      // Send to all admin emails
      for (const email of recipientEmails) {
        sendEmail({ to: email, subject, html }).catch((err) =>
          console.error(
            `Failed to send admin notification email to ${email}:`,
            err,
          )
        );
      }
    }
  } catch (error) {
    console.error(
      "Failed to query admin users or send notification email:",
      error,
    );
  }

  return notificationId;
}
