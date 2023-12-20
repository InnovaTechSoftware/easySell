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

  @Column({ unique: true })
  document: number;

  @Column({ unique: true, nullable: false })
  user: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 'user' })
  role: string;
}
