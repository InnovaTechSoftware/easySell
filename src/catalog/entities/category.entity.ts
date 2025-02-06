import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { SubCategory } from './subcategory.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SubCategory, (subcategory) => subcategory.category, {
    cascade: true,
  })
  subCategories: SubCategory[];
}
