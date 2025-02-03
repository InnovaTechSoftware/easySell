import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppQueue } from './queues/whatsapp.queue';
import { UsersService } from 'src/users/users.service';
import { LoggerService } from 'src/logger/logger.service';
import { WhatsAppController } from './whatsapp.controller';
import { UsersModule } from 'src/users/users.module';
import { LoggingModule } from 'src/logger/logger.module';
import { RedisModule } from 'src/cache-handler/cache-handler.module';

@Module({
  imports: [UsersModule, LoggingModule, RedisModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService, WhatsAppQueue],
})
export class WhatsAppMudule {}
