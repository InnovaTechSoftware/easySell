import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Queue } from '../../queues/abstract-queue';
import { Quote } from '../entities/quote.entity';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from '../../users/users.service';
import { LoggerService } from 'src/logger/logger.service';
import { RedisClientType } from 'redis';
import { RedisClientService } from 'src/cache-handler/clients/redisClient';

@Injectable()
export class EmailQueue
  extends Queue<Quote>
  implements OnModuleInit, OnModuleDestroy
{
  private users: User[] = [];
  private currentUserIndex: number = 0;
  private subscriberClient: RedisClientType;

  constructor(
    private readonly mailer: MailerService,
    private readonly userService: UsersService,
    private readonly logger: LoggerService,
    private readonly redisClientService: RedisClientService,
  ) {
    super();
  }

  async onModuleInit() {
    this.subscriberClient = this.redisClientService.getSubscriberClient();
    await this.refreshUsers();

    await this.subscriberClient.subscribe('user:created', async (message) => {
      this.logger.getLogger().info('Nuevo usuario creado, actualizando lista');
      await this.refreshUsers();
    });
  }

  async onModuleDestroy() {
    if (this.subscriberClient) {
      await this.subscriberClient.unsubscribe('user:created');
    }
  }

  public peekNextUser(): User | null {
    if (this.users.length === 0) {
      this.logger.getLogger().warn('No hay usuarios disponibles.');
      return null;
    }
    return this.users[this.currentUserIndex];
  }

  private getNextUser(): User {
    const user = this.users[this.currentUserIndex];
    this.currentUserIndex = (this.currentUserIndex + 1) % this.users.length;
    return user;
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
  async refreshUsers(): Promise<void> {
    this.users = await this.userService.findAll();
    this.currentUserIndex = 0;
    this.logger.getLogger().info('Cola de EMAIL actualizada.');
  }
}
