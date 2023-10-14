import { User } from "src/auth/entities/user.entity";
import { Buying } from "src/buyings/entities/buying.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  stock: number;

  @Column('float')
  unitPrice: number;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.inventory
  )
  user: User;

  @ManyToOne(
    () => Buying,
    (buying) => buying.inventory
  )
  buying: Buying;

  @ManyToOne(
    () => Product,
    (product) => product.inventory,
    { eager: true}
  )
  product: Product;
}
