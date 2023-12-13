import { Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FacturasService {
 
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>
    ) { }
 
  async create(createFacturaDto: CreateFacturaDto) {
    //hace una instancia del objeto factura
    const factura = this.facturaRepository.create(createFacturaDto);
    //guarda la informacion en la base de datos
    // se puede ejecutar el .save pasando directamente el DTO
    return await this.facturaRepository.save(factura);
  }

  async findAll() {
    return await this.facturaRepository.find();
  }

  async findOne(id: number) {
    return await this.facturaRepository.findOneBy({id});
  }

  async update(id: number, updateFacturaDto: UpdateFacturaDto) {
    return await this.facturaRepository.update(id, updateFacturaDto)
  }

  async remove(id: number) {
    return await this.facturaRepository.delete({id})
  }
}
