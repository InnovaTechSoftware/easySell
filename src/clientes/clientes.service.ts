import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientesService {

constructor(
  @InjectRepository(Cliente)
  private readonly clienteRepository: Repository<Cliente>
){}

  async create(createClienteDto: CreateClienteDto) {
    const userFound = await this.clienteRepository.findOne({
      where: {
        document: createClienteDto.document
      }
    }) 

    if(userFound) {
      return new HttpException("Cliente already exists", HttpStatus.CONFLICT)
    }

    const newClient = await this.clienteRepository.create(createClienteDto)
    return this.clienteRepository.save(newClient)

  }

  async findAll() {
    return await this.clienteRepository.find()
  }

  async findOne(id: number) {
    const userFound = await this.clienteRepository.findOne({
      where: {id}
    });

    if(!userFound){
      return new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return userFound;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const userFound = await this.clienteRepository.findOne({
      where: {id}
    });
    if(!userFound){
      return new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    const userUpdate = await this.clienteRepository.update(id, updateClienteDto)

    return userUpdate;
  }

  async remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}
