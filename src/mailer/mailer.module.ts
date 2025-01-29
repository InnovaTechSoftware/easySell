import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import {LoggingModule} from 'src/logger/logger.module';

@Module({
  imports: [
    LoggingModule
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
