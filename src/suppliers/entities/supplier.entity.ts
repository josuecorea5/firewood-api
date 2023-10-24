import { User } from "../../auth/entities/user.entity";
import { Buying } from "../../buyings/entities/buying.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text')
  fullName: string;

  @Column('text', { unique: true })
  telephone: string;

  @Column('text')
  address: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.supplier
  )
  user: User;

  @OneToMany(
    () => Buying,
    (buying) => buying.supplier
  )
  buying: Buying
}
