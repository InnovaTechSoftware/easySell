import { Column, Entity } from "typeorm";

@Entity()
export class Factura {

    @Column({ primary: true, generated: true})
    id:number;

    @Column({unique: true})
    name: string;

    @Column()
    sale: number;

    @Column()
    type: string;
    
    @Column()
    client: string;

}
