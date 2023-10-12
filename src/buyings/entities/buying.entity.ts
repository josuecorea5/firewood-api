import { User } from "src/auth/entities/user.entity";
import { Supplier } from "src/suppliers/entities/supplier.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(
    () => User,
    (user) => user.buying
  )
  user: User;
  
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
