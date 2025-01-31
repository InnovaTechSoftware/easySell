// src/quotes/queues/email-queue.ts

import { Injectable } from '@nestjs/common';
import { Queue } from 'src/queues/abstract-queue';
import { Quote } from '../entities/quote.entity';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from '../../users/users.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class EmailQueue extends Queue<Quote> {
  private users: User[] = [];
  private currentUserIndex: number = 0;

  constructor(
    private readonly mailer: MailerService,
    private readonly userService: UsersService,
    private readonly logger: LoggerService,
  ) {
    super();
    this.initializeUsers();
  }

  private async initializeUsers(): Promise<void> {
    this.users = await this.userService.findAll();
    // if (this.users.length === 0) {
    //   this.logger.getLogger().error('No hay usuarios disponibles en la cola.');
    // } else {
    //   this.logger.getLogger().info('Usuarios inicializados en la cola.');
    // }
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

  async process(quote: Quote): Promise<void> {
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
