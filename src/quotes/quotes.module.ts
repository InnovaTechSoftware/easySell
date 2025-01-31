import { Module } from '@nestjs/common';
import { MailerModule } from 'src/mailer/mailer.module';
import { UsersModule } from 'src/users/users.module';
import { QuotesController } from './quotes.controller';
import { QuoteService } from './quotes.service';
import { EmailQueue } from './queues/email-queue';
import { LoggingModule } from 'src/logger/logger.module';

@Module({
  imports: [MailerModule, UsersModule, LoggingModule],
  controllers: [QuotesController],
  providers: [QuoteService, EmailQueue],
})
export class QuotesModule {}
