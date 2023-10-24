import { User } from "../../auth/entities/user.entity";
import { Product } from "../../products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SaleStatus } from "../enums/sales-status.enum";

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  quantity: number;

  @Column('float')
  total: number;

  @Column('enum', { enum: SaleStatus, default: SaleStatus.COMPLETED})
  status: SaleStatus;

  @ManyToOne(
    () => Product,
    (product) => product.sales,
    { eager: true }
  )
  product: Product;

  @ManyToOne(
    () => User,
    (user) => user.sales,
  )
  user: User;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
