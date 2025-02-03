// src/whatsapp/queues/whatsapp.queue.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { LoggerService } from 'src/logger/logger.service';
import { Queue } from 'src/queues/abstract-queue';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RedisClientService } from 'src/cache-handler/clients/redisClient';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WhatsAppQueue extends Queue<User> implements OnModuleInit {
  private users: User[] = [];
  private currentUserIndex: number = 0;
  private redisClient: RedisClientType; // Cliente de Redis

  constructor(
    private readonly userService: UsersService,
    private readonly logger: LoggerService,
    private readonly redisClientService: RedisClientService,
    // private readonly eventEmitter: EventEmitter2, // Inyectar RedisClientService
  ) {
    super();
  }

  async onModuleInit() {
    // this.eventEmitter.on('redis.ready', async () => {
    //   this.redisClient = this.redisClientService.getClient();
    //   console.log('Redis client ready in WhatsAppQueue');

    // Inicializar la lista de usuarios al iniciar el módulo
    await this.refreshUsers();

    // Suscribirse al evento 'user:created' en Redis
    //   this.redisClient.subscribe('user:created', async (message) => {
    //     this.logger
    //       .getLogger()
    //       .info('Nuevo usuario creado, actualizando lista de usuarios...');
    //     await this.refreshUsers(); // Actualizar la lista de usuarios
    //   });
    // });
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
    this.logger.getLogger().info('Lista de usuarios actualizada.');
  }
}
