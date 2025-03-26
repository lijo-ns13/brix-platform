// services/email.service.ts
import nodemailer from "nodemailer";
import { IEmailService } from "../interfaces/IEmailService";

export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: '"Brix Platform" <no-reply@brix.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetURL = `http://localhost:5173/reset-password?token=${token}`;
    const mailOptions = {
      from: '"Brix Platform" <no-reply@brix.com>',
      to: email,
      subject: "Reset Your Password",
      text: `Click the link to reset your password: ${resetURL}`,
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
