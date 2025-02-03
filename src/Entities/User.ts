import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number
}

@Entity()
export class userAuth {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    password: string;
  }
  