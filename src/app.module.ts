import { Module } from '@nestjs/common';
import { FacturasModule } from './facturas/facturas.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    FacturasModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'Admin',
      password: 'Admin',
      database: 'db_nestjs',
      autoLoadEntities: true,
      synchronize: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
