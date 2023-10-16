import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  public_id: string;

  @Column('text')
  url: string;

  @ManyToOne(
    () => Product,
    (product) => product.images,
    { onDelete: 'CASCADE'}
  )
  product: Product

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}