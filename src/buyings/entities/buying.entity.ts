import { User } from "src/auth/entities/user.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";
import { Supplier } from "src/suppliers/entities/supplier.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('buyings')
export class Buying {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('integer')
  amount: number;

  @Column('float')
  price: number;

  @ManyToOne(
    () => Supplier,
    (supplier) => supplier.buying,
    { eager: true}
  )
  supplier: Supplier;

  @OneToMany(
    () => Inventory,
    (inventory) => inventory.buying,
  )
  inventory: Inventory

  @ManyToOne(
    () => User,
    (user) => user.buying
  )
  user: User;
  
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
