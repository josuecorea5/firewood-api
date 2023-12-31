import { User } from "../../auth/entities/user.entity";
import { Buying } from "../../buyings/entities/buying.entity";
import { Product } from "../../products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
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
