import { EMAIL_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME } from "@/config";
import { logger } from "@/utils/logger";
import nodemailer, { Transporter } from 'nodemailer';

class EmailService {
  private transport: Transporter;

  constructor() {
    this.transport = nodemailer.createTransport({
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD,
        },
      },);
      this.transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
  }

  /**
   * Send an email
   * @param to - recipient email address
   * @param subject - email subject
   * @param text - email content
   * @returns Promise<void>
   */
  public async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const msg = { from: EMAIL_FROM, to, subject, text };
    try {
      await this.transport.sendMail(msg);
      logger.info(`Email sent to ${to}`);
    } catch (error) {
      logger.error(`Error sending email to ${to}: ${error.message}`);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send reset password email
   * @param to - recipient email address
   * @param token - password reset token
   * @returns Promise<void>
   */
  public async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = 'Reset Password';
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,\nTo reset your password, click on this link: ${resetPasswordUrl}\nIf you did not request a password reset, please ignore this email.`;
    
    await this.sendEmail(to, subject, text);
  }

  /**
   * Send email verification
   * @param to - recipient email address
   * @param token - verification token
   * @returns Promise<void>
   */
  public async sendVerificationEmail(to: string, token: string): Promise<void> {
    const subject = 'Email Verification';
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,\nTo verify your email, click on this link: ${verificationEmailUrl}\nIf you did not create an account, please ignore this email.`;

    await this.sendEmail(to, subject, text);
  }
}

export default new EmailService();
