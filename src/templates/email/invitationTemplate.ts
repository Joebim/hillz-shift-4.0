export const invitationTemplate = (
  inviteeName: string,
  inviterName: string,
  customMessage: string,
  registrationLink: string
) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #2b3fd3 0%, #4a108a 100%);">
    <!-- Header Image -->
    <div style="background: white; padding: 0; border-radius: 10px; text-align: center; margin-bottom: 30px; overflow: hidden;">
      <img src="https://i.ibb.co/0Vj9LWTt/shift-flyer-4-0.jpg" alt="Shift 4.0" style="width: 100%; max-width: 600px; height: auto; display: block; border-radius: 10px;" />
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 10px;">
      <!-- Greeting -->
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
        Hi ${inviteeName},
      </p>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
        I hope this message finds you well! I wanted to personally invite you to join us for <strong style="color: #2b3fd3;">Shift 4.0</strong>, an incredible gathering where we'll explore deeper truths and experience spiritual transformation together.
      </p>
      
      <!-- Custom Message -->
      <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #eab308;">
        <p style="color: #333; font-size: 15px; line-height: 1.8; margin: 0; white-space: pre-wrap; font-style: italic;">"${customMessage}"</p>
      </div>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
       Come expecting clarity, fellowship and an enveiling of Christ.
      </p>
      
      <!-- Invitation Details -->
      <div style="background: #f5f7fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">You're Invited</p>
        <p style="color: #2b3fd3; font-size: 18px; margin: 0 0 20px 0; font-weight: bold;">${inviteeName}</p>
        
        <p style="color: #666; font-size: 14px; margin: 20px 0 10px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Invited By</p>
        <p style="color: #333; font-size: 18px; margin: 0; font-weight: bold;">${inviterName}</p>
      </div>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
        Please register using the link below,
      </p>

      <!-- Registration Link -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${registrationLink}" style="background: linear-gradient(135deg, #2b3fd3 0%, #4a108a 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(43,63,211,0.3); transition: transform 0.2s;">Register Now</a>
        <p style="color: #999; font-size: 12px; margin: 15px 0 0 0; word-break: break-all; line-height: 1.6;">Or copy this link: ${registrationLink}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">Shift 4.0 Team</p>
    </div>
  </div>
`;

export const registrationTemplate = (userName: string) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #2b3fd3 0%, #4a108a 100%);">
    <!-- Header Image -->
    <div style="background: white; padding: 0; border-radius: 10px; text-align: center; margin-bottom: 30px; overflow: hidden;">
      <img src="https://i.ibb.co/0Vj9LWTt/shift-flyer-4-0.jpg" alt="Shift 4.0" style="width: 100%; max-width: 600px; height: auto; display: block; border-radius: 10px;" />
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 10px;">
      <!-- Greeting -->
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
        Hi <strong style="color: #2b3fd3;">${userName}</strong>,
      </p>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
        Thank you for registering for <strong style="color: #2b3fd3;">Shift 4.0</strong>! We're thrilled to have you join us for this transformative experience.
      </p>
      
      <!-- Confirmation Details -->
      <div style="background: #f5f7fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Registration is Confirmed</p>
        <p style="color: #2b3fd3; font-size: 18px; margin: 0 0 20px 0; font-weight: bold;">${userName}</p>
        
        <p style="color: #333; font-size: 15px; line-height: 1.8; margin: 20px 0 0 0;">
          Your spot is secured! We'll be sending you more details as we get closer to the event date.
        </p>
      </div>
      
      <!-- Event Details -->
      <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #2b3fd3;">
        <p style="color: #666; font-size: 14px; margin: 0 0 15px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Event Details</p>
        <p style="color: #333; font-size: 15px; line-height: 1.8; margin: 8px 0;"><strong>Date:</strong> 31st January, 2026</p>
        <p style="color: #333; font-size: 15px; line-height: 1.8; margin: 8px 0;"><strong>Time:</strong> 10AM - 5PM</p>
        <p style="color: #333; font-size: 15px; line-height: 1.8; margin: 8px 0;"><strong>Venue:</strong> Ikenga Hall, Radisson Ikeja Lagos</p>
        <p style="color: #333; font-size: 15px; line-height: 1.8; margin: 8px 0 0 0;"><strong>Address:</strong> 42/44 Isaac John Street, GRA Ikeja Lagos, Nigeria</p>
      </div>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 30px 0 0 0;">
        We're looking forward to seeing you there and sharing this powerful experience together!
      </p>
      
      <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 20px 0 0 0;">
        Blessings,<br>
        <strong style="color: #2b3fd3;">Shift 4.0 Team</strong>
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">If you have any questions, please contact us at Convener@themysteryofchrist.org</p>
    </div>
  </div>
`;
