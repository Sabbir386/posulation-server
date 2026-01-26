import nodemailer from 'nodemailer';

const emailTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { background-color: #f5f5f5; font-family: Arial, sans-serif; color: #333; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; }
    .header { text-align: center; padding: 10px; background-color: #1d1d1d; color: #ffffff; }
    .content { padding: 20px; }
    .content h1 { font-size: 20px; color: #333; }
    .button { display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #00c853; color: #ffffff; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 10px; background-color: #1d1d1d; color: #ffffff; font-size: 14px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>CASHOOZ</h2>
    </div>
    <div class="content">
      <p>You have requested to reset your password on Cashooz.com.</p>
      <p>If you did <strong>not</strong> request a password reset, please ignore this mail.</p>
      <p>In any case of fraudulent reset requests that were not requested by you, please contact our support immediately!</p>
      <div class="text-center mt-6 text-white">
        <a href="${resetLink}" class="button text-white">Reset Password</a>
      </div>
      <p>The code will expire after 10 minutes.</p>
      <p>CASHOOZ Team</p>
    </div>
    <div class="footer">
      &copy; 2024 CASHOOZ
    </div>
  </div>
</body>
</html>
`;

export const sendEmail = async (userEmail: string, resetLink: string) => {
  // Check for required environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing email environment variables (EMAIL_USER, EMAIL_PASS)");
    return;
  }

  // Create the email transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Using app password for Gmail
    },
    logger: true, // Enable logging for debugging
    debug: true, // Enable SMTP communication debugging
  });

  try {
    // Verify the SMTP connection
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP verification error:", error);
          reject(error);
        } else {
          console.log("SMTP connection verified.");
          resolve(success);
        }
      });
    });

    // Prepare the email data
    const mailOptions = {
      from: `"cashooz" <${process.env.EMAIL_USER}>`, // Set sender name
      to: userEmail,
      subject: "Reset your password within 10 mins!",
      text: "Password change link",
      html: emailTemplate(resetLink),
    };


    // Send the email
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          reject(err);
        } else {
          console.log(`Email sent successfully to ${userEmail}:`, info.response);
          resolve(info);
        }
      });
    });

  } catch (error: any) {
    console.error("Error during email sending process:", error.message);
    if (error.response) {
      console.error("SMTP response error:", error.response);
    }
  }
};
