import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import * as nodemailer from 'nodemailer';
import { LoggerService } from 'src/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { EmailConfig } from './interfaces/email-config.interface';

@Injectable()
export class MailerService implements OnModuleInit {
  private readonly transporter: nodemailer.Transporter;
  private readonly emailConfig: EmailConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.emailConfig = this.loadEmailConfig();
    this.transporter = this.createTransporter();
  }

  private loadEmailConfig(): EmailConfig {
    return {
      host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('EMAIL_PORT', 465),
      user: this.configService.get<string>('EMAIL_USER'),
      password: this.configService.get<string>('EMAIL_PASSWORD'),
    };
  }

  private createTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: this.emailConfig.host,
      port: this.emailConfig.port,
      secure: true,
      auth: {
        user: this.emailConfig.user,
        pass: this.emailConfig.password,
      },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      const isValid = await this.verifyTransporter();
      if (!isValid) {
        throw new Error('SMTP configuration verification failed');
      }
      this.logger.getLogger().info('Mail service initialized successfully');
    } catch (error) {
      this.logger
        .getLogger()
        .error('Failed to initialize mail service:', error);
    }
  }

  async verifyTransporter(): Promise<boolean> {
    try {
      await this.transporter.verify();
      // this.logger.getLogger().info('SMTP transporter verified successfully');
      return true;
    } catch (error) {
      this.logger.getLogger().error('SMTP verification failed:', error);
      return false;
    }
  }

  async sendMail(data: CreateMailDto): Promise<boolean> {
    const recipient = data.to || this.emailConfig.user;
    const emailData = {
      from: this.emailConfig.user,
      to: recipient,
      subject: data.subject,
      html: data.html,
    };

    try {
      await this.transporter.sendMail(emailData);
      // this.logger.getLogger().info(`Email sent successfully to ${recipient}`);
      return true;
    } catch (error) {
      this.logger
        .getLogger()
        .error(`Failed to send email to ${recipient}:`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
