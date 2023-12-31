import { User } from "../../auth/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { Inventory } from "../../inventory/entities/inventory.entity";
import { Sale } from "../../sales/entities/sale.entity";

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

  @OneToMany(
    () => Sale,
    (sale) => sale.product
  )
  sales: Sale

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
