import {
  Controller,
  Post,
  Body,
  
} from '@nestjs/common';
import { MailerService } from './mailer.service';
import { CreateMailDto } from './dto/create-mail.dto';

@Controller('email')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  async sendMail(@Body() createMailDto: CreateMailDto) {
    return await this.mailerService.sendMail(createMailDto);
  }
}
