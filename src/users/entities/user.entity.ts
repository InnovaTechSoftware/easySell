import { Role } from '../../common/enums/rol.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  documentType: string;

  @Column({ unique: true, nullable: false })
  document: number;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Column({ unique: true, nullable: false })
  user: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ type: 'enum', default: Role.User, enum: Role })
  role: Role;
}
