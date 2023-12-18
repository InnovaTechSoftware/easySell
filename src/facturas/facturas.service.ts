import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { Repository } from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { CreateClienteDto } from 'src/clientes/dto/create-cliente.dto';


@Injectable()
export class FacturasService {
 
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>
    
    ) { }
 
  async create(createFacturaDto: CreateFacturaDto,) {
    
      const cliente = await this.validateClient(createFacturaDto.client);
      return await this.facturaRepository.save({
        ...createFacturaDto,
        client: cliente,
      });

  }

  async findAll() {
    return await this.facturaRepository.find();
  }

  async findOne(id: number) {
   
    const facturaFound = await this.facturaRepository.findOne({
      where: {id}
    });
    
    if(!facturaFound){
      return new HttpException('factura not found', HttpStatus.NOT_FOUND)
    }

    return facturaFound;
  }

  async update(id: number, updateFacturaDto: UpdateFacturaDto) {
    // const facturaFound = await this.facturaRepository.findOne({
    //   where: {id}
    // });
    // if(!facturaFound){
    //   return new HttpException('factura not found', HttpStatus.NOT_FOUND)
    // }
    // const updatefactura = await this.facturaRepository.update(id, updateFacturaDto)
    
    // return updatefactura;
  }

  async remove(id: number) {
    const result  = await this.facturaRepository.delete({id});

        if (result.affected === 0) {
            return new HttpException('factura Not Found', HttpStatus.NOT_FOUND)
        }

        return result;

    }

    private async validateClient(client: number) {
      const clienteEntity = await this.clienteRepository.findOneBy({ document: client });
    
      if (!clienteEntity) {
        return new HttpException('client not found', HttpStatus.NOT_FOUND)
      }
    
      return clienteEntity;
    }
  
}
