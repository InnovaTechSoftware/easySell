import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ClientesService } from 'src/clientes/clientes.service';
import { LoggingModule } from 'src/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Factura]), ClientesModule, LoggingModule],
  controllers: [FacturasController],
  providers: [FacturasService, ClientesService],
})
export class FacturasModule {}
