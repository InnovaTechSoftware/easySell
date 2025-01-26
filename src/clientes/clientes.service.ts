import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { LoggerStrategySelector } from '../logger/strategies/logger-strategy.selector'; // Adjust path as needed
import { Logger } from 'winston';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class ClientesService {
  private logger;

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.getLogger();
  }

  async create(createClienteDto: CreateClienteDto) {
    try {
      this.logger.info(
        `Attempting to create client with document: ${createClienteDto.document}`,
      );

      const userFound = await this.clienteRepository.findOne({
        where: {
          document: createClienteDto.document,
        },
      });

      if (userFound) {
        this.logger.warn(
          `Client with document ${createClienteDto.document} already exists`,
        );
        throw new HttpException('Cliente already exists', HttpStatus.CONFLICT);
      }

      const newClient = this.clienteRepository.create(createClienteDto);
      const savedClient = await this.clienteRepository.save(newClient);

      this.logger.info(
        `Client created successfully with ID: ${savedClient.id}`,
      );
      return savedClient;
    } catch (error) {
      this.logger.error(`Error creating client: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      this.logger.info('Fetching all clients');
      const clients = await this.clienteRepository.find();
      this.logger.info(`Retrieved ${clients.length} clients`);
      return clients;
    } catch (error) {
      this.logger.error(
        `Error fetching clients: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      this.logger.info(`Searching for client with ID: ${id}`);
      const userFound = await this.clienteRepository.findOne({
        where: { id },
      });

      if (!userFound) {
        this.logger.warn(`Client with ID ${id} not found`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      this.logger.info(`Client found with ID: ${id}`);
      return userFound;
    } catch (error) {
      this.logger.error(`Error finding client: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    try {
      this.logger.info(`Attempting to update client with ID: ${id}`);
      const userFound = await this.clienteRepository.findOne({
        where: { id },
      });

      if (!userFound) {
        this.logger.warn(`Client with ID ${id} not found for update`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const userUpdate = await this.clienteRepository.update(
        id,
        updateClienteDto,
      );
      this.logger.info(`Client with ID ${id} updated successfully`);
      return userUpdate;
    } catch (error) {
      this.logger.error(`Error updating client: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      this.logger.info(`Attempting to remove client with ID: ${id}`);
      // Implement actual removal logic
      this.logger.info(`Client with ID ${id} removed`);
      return `This action removes a #${id} cliente`;
    } catch (error) {
      this.logger.error(`Error removing client: ${error.message}`, error.stack);
      throw error;
    }
  }
}
