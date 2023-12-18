import { Factura } from "src/facturas/entities/factura.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    documentType: string;

    @Column({unique: true})
    document: number;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @OneToMany(() => Factura, (factura) => factura.client)
    facturas: Factura[]
}
