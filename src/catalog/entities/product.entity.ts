import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SubCategory } from './subcategory.entity';
import { IsNotEmpty, MinLength } from 'class-validator';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @MinLength(6)
  @Column()
  name: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  imgname: string;

  @Column({ nullable: true })
  technicalsheet: string;

  @Column()
  um: string;

  @Column()
  presentation: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  uses: string;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategory;

  toJSON() {
    return {
      category: this.subCategory.category.name,
      subcategory: this.subCategory.name,
      name: this.name,
      um: this.um,
      presentation: this.presentation,
      imgname: this.imgname,
      technicalsheet: this.technicalsheet,
      description: this.description,
      uses: this.uses,
      id: this.id,
    };
  }
}
