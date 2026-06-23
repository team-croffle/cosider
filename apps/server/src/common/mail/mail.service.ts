import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendVerificationMail(email: string, token: string): Promise<void> {
    const frontUrl = this.configService.get<string>('CLIENT_URL', 'http://localhost:3000');

    const verificationUrl = `${frontUrl}/auth/verify?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[CoSider] Verify your email',
        template: './verification',
        context: {
          url: verificationUrl,
        },
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw new InternalServerErrorException('Failed to send verification email');
    }
  }
}
