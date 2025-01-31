import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuoteService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { EmailQueue } from './queues/email-queue';

@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuoteService,
    private readonly emailQueue: EmailQueue,
  ) {}

  @Post()
  async CreateQuote(@Body() createQuoteDto: CreateQuoteDto): Promise<void> {
    await this.quotesService.createQuote(createQuoteDto);
  }

  // @Get('queue-status')
  // async getQueueStatus() {
  //   return this.emailQueue.getQueueStatus(); // Devuelve el estado de la cola
  // }

  @Get('next-user')
  async getNextUser() {
    const nextUser = this.emailQueue.peekNextUser(); // Obtiene el siguiente usuario
    if (!nextUser) {
      return { message: 'No hay usuarios disponibles en la cola.' };
    }
    return {
      message: 'Siguiente usuario disponible',
      user: {
        id: nextUser.id,
        name: nextUser.name,
        email: nextUser.email,
      },
    };
  }
}
