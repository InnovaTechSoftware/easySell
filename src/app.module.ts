import { Module } from '@nestjs/common';
import { FacturasModule } from './facturas/facturas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from './logger/logger.module';
import { RedisModule } from './cache-handler/cache-handler.module';
import { HealthModule } from './health/health.module';
import { MailerModule } from './mailer/mailer.module';
import { ErrorHandlingModule } from './error-handler/error-handler.module';
import { QuotesModule } from './quotes/quotes.module';
import { WhatsAppMudule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.POSTGRES_SSL === 'true',
      extra: {
        ssl:
          process.env.POSTGRES_SSL === 'true'
            ? {
                rejectUnauthorized: false,
              }
            : null,
      },
    }),
    ClientesModule,
    FacturasModule,
    UsersModule,
    AuthModule,
    LoggingModule,
    RedisModule,
    HealthModule,
    MailerModule,
    ErrorHandlingModule,
    QuotesModule,
    WhatsAppMudule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
