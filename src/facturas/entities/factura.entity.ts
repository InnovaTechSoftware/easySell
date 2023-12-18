import { Cliente } from "src/clientes/entities/cliente.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Factura {

    @Column({ primary: true, generated: true})
    id:number;

    @Column()
    name: string;

    @Column()
    sale: number;

    @Column()
    type: string;
    

    @ManyToOne(() => Cliente, (cliente) => cliente.id,{
        eager: true
    })
    client: Cliente;
}
