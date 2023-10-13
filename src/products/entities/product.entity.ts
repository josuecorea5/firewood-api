import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('text')
  description: string;

  @Column('float')
  price: number;

  @Column('bool', { default: true })
  isAvailable: boolean;

  @ManyToOne(
    () => User,
    (user) => user.product,
  )
  user: User;

  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    { cascade: true, eager: true}
  )
  images: ProductImage[];

  @OneToMany(
    () => Inventory,
    (inventory) => inventory.product
  )
  inventory: Inventory

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
