import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  sendAuthCode(email: string, code: string) {
    this.logger.log(`Auth confirmation code for ${email}: ${code}`);
  }
}
