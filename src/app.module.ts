import { Module } from '@nestjs/common';
import { FacturasModule } from './facturas/facturas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'Admin',
      password: 'Admin',
      database: 'db_nestjs',
      autoLoadEntities: true,
      synchronize: true
    }),
    ClientesModule,
    FacturasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
