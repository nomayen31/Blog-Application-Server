import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD,
    },
});
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
                console.log("Sending verification email to:", user.email);
                const info = await transporter.sendMail({
                    from: '"Prisma Blog" <nomayem.ohin@gmail.com>',
                    to: user.email,
                    subject: "Verify your email – Prisma Blog",
                    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8; padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background:#111827; padding:28px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:26px;">Prisma Blog</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px; color:#1f2937;">
              <h2 style="margin-top:0;">Verify your email address</h2>

              <p style="font-size:15px;">
                Hello <strong>${user.name || "there"}</strong>,
              </p>

              <p style="font-size:15px; line-height:1.6;">
                Thank you for joining <strong>Prisma Blog</strong>.  
                Please confirm your email address to activate your account.
              </p>

              <div style="text-align:center; margin:40px 0;">
                <a href="${verificationUrl}" 
                   style="background:#2563eb; color:#ffffff; padding:14px 32px; 
                          text-decoration:none; border-radius:8px; 
                          font-weight:600; font-size:15px; display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#4b5563;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; font-size:13px; color:#2563eb;">
                ${verificationUrl}
              </p>

              <p style="margin-top:30px; font-size:14px; color:#6b7280;">
                If you did not create this account, you can safely ignore this email.
              </p>

              <p style="margin-top:40px;">
                — <strong>Prisma Blog Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:18px; text-align:center; color:#9ca3af; font-size:12px;">
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
      `
                });
                console.log("Verification email sent:", info.messageId);
            }
            catch (error) {
                console.error("❌ Failed to send verification email:", error);
            }
        }
    }
});
//# sourceMappingURL=auth.js.map