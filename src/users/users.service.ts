import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserEventsService } from './events/users-events.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userEventsService: UserEventsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    await this.userEventsService.publishUserCreated(savedUser);

    return savedUser;
  }

  findOneByUser(user: string) {
    return this.userRepository.findOneBy({ user });
  }

  findByUserWithPassword(user: string) {
    return this.userRepository.findOne({
      where: { user },
      select: [
        'id',
        'name',
        'lastname',
        'documentType',
        'document',
        'user',
        'password',
        'role',
      ],
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ id });

    if (updatedUser) {
      await this.userEventsService.publishUserUpdated(updatedUser);
    }

    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (user) {
      await this.userRepository.delete(id);
      await this.userEventsService.publishUserDeleted(id);
      return true;
    }

    return false;
  }
}
