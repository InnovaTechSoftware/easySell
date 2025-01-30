import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { ErrorResponse } from './interfaces/error-response.interface';

@Injectable()
export class ErrorHandlerService {
  constructor(private readonly logger: LoggerService) {}

  logError(exception: unknown, errorResponse: ErrorResponse): void {
    const logMessage = {
      ...errorResponse,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    if (errorResponse.statusCode >= 500) {
      this.logger.getLogger().error('Server error: ', logMessage);
    } else {
      this.logger.getLogger().warn('Client error: ', logMessage);
    }
  }

  // async handleError(error: Error): Promise<void> {
  //   // Aquí puedes implementar lógica adicional como:
  //   // - Notificar a un servicio de monitoreo
  //   // - Enviar alertas
  //   // - Guardar en base de datos
  //   // - etc.
  // }
}
