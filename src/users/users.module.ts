import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RedisModule } from 'src/cache-handler/cache-handler.module';
import { UserEventsService } from './events/users-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  controllers: [UsersController],
  providers: [UsersService, UserEventsService],
  exports: [UsersService, UserEventsService],
})
export class UsersModule {}
