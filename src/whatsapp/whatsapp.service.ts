import { Injectable } from '@nestjs/common';
import { WhatsAppQueue } from './queues/whatsapp.queue';

@Injectable()
export class WhatsAppService {
  constructor(private readonly whatsAppQueue: WhatsAppQueue) {}

  async assignChat(): Promise<string> {
    const user = await this.whatsAppQueue.getNextUser();

    this.whatsAppQueue.enqueue(user);

    return await this.whatsAppQueue.process();
  }
}
