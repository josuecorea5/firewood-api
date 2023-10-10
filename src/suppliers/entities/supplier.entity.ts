import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @Column('date', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.supplier
  )
  user: User;
}
