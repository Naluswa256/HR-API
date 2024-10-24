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


    // Send leave request approval email
    public async sendLeaveApprovalEmail(to: string, leaveType: string, startDate: Date, endDate: Date): Promise<void> {
      const subject = 'Leave Request Approved';
      const text = `Dear employee,\nYour ${leaveType} leave request for the period ${startDate.toISOString()} to ${endDate.toISOString()} has been approved.\nPlease contact HR for further details.`;
      
      await this.sendEmail(to, subject, text);
    }
  
    // Send leave request rejection email
    public async sendLeaveRejectionEmail(to: string, leaveType: string, reason: string): Promise<void> {
      const subject = 'Leave Request Rejected';
      const text = `Dear employee,\nYour ${leaveType} leave request has been rejected for the following reason: ${reason}.\nPlease contact HR if you have any questions.`;
      
      await this.sendEmail(to, subject, text);
    }

    public async sendOvertimeApprovalEmail(to: string, overtimeDate: Date, hours: number): Promise<void> {
      const subject = 'Overtime Request Approved';
      const text = `Dear employee,\nYour overtime request for ${overtimeDate.toISOString()} for ${hours} hour(s) has been approved.\nThank you for your hard work!`;
      
      await this.sendEmail(to, subject, text);
    }
  
    // Send rejected overtime request email
    public async sendOvertimeRejectionEmail(to: string, reason: string): Promise<void> {
      const subject = 'Overtime Request Rejected';
      const text = `Dear employee,\nYour overtime request has been rejected for the following reason: ${reason}.\nPlease contact HR if you have any questions.`;
      
      await this.sendEmail(to, subject, text);
    }
}

export const emailService = new EmailService();
