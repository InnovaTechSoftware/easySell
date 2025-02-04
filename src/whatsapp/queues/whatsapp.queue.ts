import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { LoggerService } from 'src/logger/logger.service';
import { Queue } from 'src/queues/abstract-queue';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RedisClientService } from 'src/cache-handler/clients/redisClient';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WhatsAppQueue
  extends Queue<User>
  implements OnModuleInit, OnModuleDestroy
{
  private users: User[] = [];
  private currentUserIndex: number = 0;
  private subscriberClient: RedisClientType;

  constructor(
    private readonly userService: UsersService,
    private readonly logger: LoggerService,
    private readonly redisClientService: RedisClientService,
  ) {
    super();
  }

  async onModuleInit() {
    // Usar el cliente subscriber en lugar del cliente principal
    this.subscriberClient = this.redisClientService.getSubscriberClient();
    await this.refreshUsers();

    // Suscribirse usando el cliente subscriber
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
      this.logger.getLogger().warn('No hay usuarios disponibles');
      return null;
    }
    return this.users[this.currentUserIndex];
  }

  public getNextUser(): User {
    const user = this.users[this.currentUserIndex];
    this.currentUserIndex = (this.currentUserIndex + 1) % this.users.length;
    return user;
  }

  async process(): Promise<string> {
    const user = this.dequeue();

    const whatsAppLink = this.generateWhatsAppLink(user.phone);
    this.logger
      .getLogger()
      .info(`Chat asignado a ${user.name}: WhatsAppLink ${whatsAppLink}`);

    return whatsAppLink;
  }

  private generateWhatsAppLink(phone: string): string {
    return `https://wa.me/+57${phone}`;
  }

  async refreshUsers(): Promise<void> {
    this.users = await this.userService.findAll();
    this.currentUserIndex = 0;
    this.logger.getLogger().info('Cola de WhatsApp actualizada.');
  }
}
