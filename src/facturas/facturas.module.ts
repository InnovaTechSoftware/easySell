import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ClientesService } from 'src/clientes/clientes.service';


@Module({
  imports: [TypeOrmModule.forFeature([Factura,]), ClientesModule],
  controllers: [FacturasController],
  providers: [FacturasService, ClientesService],
})
export class FacturasModule {}
