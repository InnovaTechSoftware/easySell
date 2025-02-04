import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Quote } from '../entities/quote.entity';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from '../../users/users.service';
import { LoggerService } from 'src/logger/logger.service';
import { RedisClientType } from 'redis';
import { RedisClientService } from 'src/cache-handler/clients/redisClient';
import { UserAwareQueue } from 'src/queues/user-aware.queue';

@Injectable()
export class EmailQueue extends UserAwareQueue<Quote> {
  constructor(
    private readonly mailer: MailerService,
    usersService: UsersService,
    logger: LoggerService,
    redisClientService: RedisClientService,
  ) {
    super(usersService, logger, redisClientService);
  }

  async process(quote: Quote): Promise<string | void> {
    const user = this.getNextUser();

    try {
      const emailContent = this.generateEmailContent(quote, user);
      await this.mailer.sendMail({
        to: user.email,
        subject: 'Nueva Cotización',
        html: emailContent,
      });
      this.logger.getLogger().info(`Cotización enviada a ${user.email}`);
    } catch (error) {
      this.logger
        .getLogger()
        .error(`Error enviando correo a ${user.email}:`, error);
    }
  }

  private generateEmailContent(quote: Quote, user: User): string {
    return `
      <h1>Haz recibido una nueva Cotizacion</h1>
      <p>Hola ${user.name},</p>
      <p>Has recibido una nueva cotización de ${quote.email}:</p>
      <ul>${quote.product}</ul>
    `;
  }
}
