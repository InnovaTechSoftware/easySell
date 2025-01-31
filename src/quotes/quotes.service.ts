import { Injectable } from '@nestjs/common';
import { EmailQueue } from './queues/email-queue';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Quote } from './entities/quote.entity';

@Injectable()
export class QuoteService {
  constructor(private readonly emailQueue: EmailQueue) {}

  async createQuote(createQuoteDto: CreateQuoteDto) {
    const quote: Quote = {
      email: createQuoteDto.email,
      product: createQuoteDto.product,
      createdAt: new Date(),
    };
    this.emailQueue.enqueue(quote);
  }
}
