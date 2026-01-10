export const invitationTemplate = (
  inviteeName: string,
  inviterName: string,
  customMessage: string,
  registrationLink: string
) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #2b3fd3 0%, #4a108a 100%);">
    <!-- Banner -->
    <div style="background: white; padding: 40px 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2b3fd3; margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 1px;">Hillz Shift 4.0</h1>
      <p style="color: #666; margin: 12px 0 0 0; font-size: 16px; font-style: italic;">A Life-Changing Experience</p>
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 10px;">
      <!-- Greeting -->
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
        Hi ${inviteeName},
      </p>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
        I hope this message finds you well! I wanted to personally invite you to join us for <strong style="color: #2b3fd3;">Hillz Shift 4.0</strong>, an incredible gathering where we'll explore deeper truths and experience spiritual transformation together.
      </p>
      
      <!-- Custom Message -->
      <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #eab308;">
        <p style="color: #333; font-size: 15px; line-height: 1.8; margin: 0; white-space: pre-wrap; font-style: italic;">"${customMessage}"</p>
      </div>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
        This invitation comes from the heart, and I believe this event will be meaningful for you.
      </p>
      
      <!-- Invitation Details -->
      <div style="background: #f5f7fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">You're Invited</p>
        <p style="color: #2b3fd3; font-size: 18px; margin: 0 0 20px 0; font-weight: bold;">${inviteeName}</p>
        
        <p style="color: #666; font-size: 14px; margin: 20px 0 10px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Invited By</p>
        <p style="color: #333; font-size: 18px; margin: 0; font-weight: bold;">${inviterName}</p>
      </div>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
        I would love to have you join us. Please register using the link below, and I'll be looking forward to seeing you there!
      </p>
      
      <!-- Registration Link -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${registrationLink}" style="background: linear-gradient(135deg, #2b3fd3 0%, #4a108a 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(43,63,211,0.3); transition: transform 0.2s;">Register Now</a>
        <p style="color: #999; font-size: 12px; margin: 15px 0 0 0; word-break: break-all; line-height: 1.6;">Or copy this link: ${registrationLink}</p>
      </div>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 30px 0 0 0;">
        Can't wait to share this experience with you!
      </p>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 20px 0 0 0;">
        Blessings,<br>
        <strong style="color: #2b3fd3;">${inviterName}</strong>
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">Hillz Shift 4.0 Team</p>
    </div>
  </div>
`;

export const registrationTemplate = (userName: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
    <h2 style="color: #6366f1;">Registration Confirmed!</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Thank you for registering for <strong>Hillz Shift 4.0</strong>. Your spot is secured!</p>
    <p>Stay tuned for more updates as we get closer to the event.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #666;">Hillz Shift Team</p>
  </div>
`;
