import { Buying } from "../../buyings/entities/buying.entity";
import { Inventory } from "../../inventory/entities/inventory.entity";
import { Product } from "../../products/entities/product.entity";
import { Sale } from "../../sales/entities/sale.entity";
import { Supplier } from "../../suppliers/entities/supplier.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { unique: true })
  email: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user']})
  roles: string[];

  @Column('text', { default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png' })
  image: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @OneToMany(
    () => Supplier,
    (supplier) => supplier.user,
  )
  supplier: Supplier;

  @OneToMany(
    () => Product,
    (product) => product.user
  )
  product: Product;

  @OneToMany(
    () => Buying,
    (buying) => buying.user
  )
  buying: Buying

  @OneToMany(
    () => Inventory,
    (inventory) => inventory.user
  )
  inventory: Inventory

  @OneToMany(
    () => Sale,
    (sale) => sale.user
  )
  sales: Sale

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  emailToLowerCaseOnUpdate() {
    this.emailToLowerCase();
  }
}
