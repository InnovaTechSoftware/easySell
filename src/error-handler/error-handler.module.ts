import { Module, Global } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ErrorHandlerService } from './error-handler.service';
import { LoggingModule } from '../logger/logger.module';

@Global()
@Module({
  imports: [LoggingModule],
  providers: [
    ErrorHandlerService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [ErrorHandlerService],
})
export class ErrorHandlingModule {}
