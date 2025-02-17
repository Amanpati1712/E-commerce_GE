
import { 
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, OneToMany 
} from "typeorm";
import { IsEmail,IsDate, IsNotEmpty, IsOptional, MinLength, IsString, Matches,IsNumber, Min,Max, IsBoolean } from "class-validator";
import {Product, userAuth } from "../../User/Entities/User";


// Order Table
@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => userAuth, (user) => user.orders)
    @IsNotEmpty({ message: "User is required" })
    user:userAuth;

    @ManyToMany(() => Product, (product) => product.orders)
    @JoinTable()
    @IsNotEmpty({ message: "At least one product is required" })
    products: Product[];

    @Column({ type: "decimal"})
    @IsNotEmpty({ message: "Total price is required" })
    @IsNumber({}, { message: "Total price must be a number" })
    @Min(0, { message: "Total price must be at least 0" })
    totalPrice: number;

    @Column()
    @IsNotEmpty({ message: "Payment mode is required" })
    @IsString({ message: "Payment mode must be a string" })
    paymentMode: string;

    @Column()
    @IsNotEmpty({ message: "Payment status is required" })
    @IsString({ message: "Payment status must be a string" })
    paymentStatus: string;

    @Column()
    @IsNotEmpty({ message: "Shipping address is required" })
    @IsString({ message: "Shipping address must be a string" })
    shippingAddress: string;

    @Column()
    @IsNotEmpty({ message: "Order status is required" })
    @IsString({ message: "Order status must be a string" })
    orderStatus: string;

    @CreateDateColumn()
    orderDate: Date;
}
