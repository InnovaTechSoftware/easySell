import { Controller, Get } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Get()
  async assignChat() {
    const whatsAppLink = await this.whatsAppService.assignChat();
    return { whatsAppLink };
  }
}
