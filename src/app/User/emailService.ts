import nodemailer from "nodemailer";

const emailTemplate = (verifyLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - Cashooz</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f7fc;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .container {
      background-color: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 600px;
      width: 100%;
    }
    h1 {
      color: #4CAF50;
      font-size: 28px;
      margin-bottom: 20px;
    }
    p {
      color: #333;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .button {
      background-color: #4CAF50;
      color: white;
      font-size: 16px;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      transition: background-color 0.3s ease-in-out;
    }
    .button:hover {
      background-color: #45a049;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
    }
    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    @media (max-width: 600px) {
      .container {
        padding: 20px;
      }
      h1 {
        font-size: 24px;
      }
      p {
        font-size: 14px;
      }
      .button {
        font-size: 14px;
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify Your Cashooz Account</h1>
    <p>Thank you for signing up! Please verify your email to activate your account.</p>
    <p><strong>Verification Link:</strong> <a href="${verifyLink}" style="color: #4CAF50;">${verifyLink}</a></p>
    <p>Or, click the button below:</p>
    <a href="${verifyLink}" class="button">Verify Email</a>
    <p>If you didn't request this, you can ignore this email.</p>

    <div class="footer">
      <p>Need help? <a href="mailto:support@cashooz.com">Contact Support</a></p>
      <p>Cashooz &copy; 2024 | All rights reserved</p>
    </div>
  </div>
</body>
</html>
`;

export const sendVerificationEmail = async (email: string, verifyLink: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Cashooz"<${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Cashooz Account",
      html: emailTemplate(verifyLink),
      replyTo: "support@cashooz.com", // Helps avoid spam folders
    });

    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
