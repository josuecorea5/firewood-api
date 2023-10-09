import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text')
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

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  emailToLowerCaseOnUpdate() {
    this.emailToLowerCase();
  }
}
