import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { LoggerStrategySelector } from '../logger/strategies/logger-strategy.selector';


@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesService, LoggerStrategySelector],
  exports: [TypeOrmModule]
})
export class ClientesModule {}
