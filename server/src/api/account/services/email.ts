import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email: string, username: string, resetToken: string): Promise<void> => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${username},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send password reset email.");
  }
};
