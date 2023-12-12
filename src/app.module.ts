import { Module } from '@nestjs/common';
import { FacturasModule } from './facturas/facturas.module';

@Module({
  imports: [FacturasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
