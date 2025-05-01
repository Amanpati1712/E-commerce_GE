import { 
    Entity, PrimaryGeneratedColumn,PrimaryColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, OneToMany 
} from "typeorm";
import { IsEmail,IsDate, IsNotEmpty, IsOptional, MinLength, IsString, Matches,IsNumber, Min,Max, IsBoolean, IsIn } from "class-validator";
import { Order } from "../../Order/Entities/orderEntities";


@Entity()
export class userAuth {
    @PrimaryGeneratedColumn() // This makes `id` auto-incrementing
    id: number;

    @Column({ nullable: false, default: 'Unknown' })
    @IsNotEmpty({ message: "Name is required" })
    @IsString({ message: "Name must be a string" })
    name: string;

    @Column({ nullable: false, unique: true })
    @IsEmail({}, { message: "Invalid email format" })
    @Matches(/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,4}$/, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;
    
    @Column({nullable: false})
    @IsNotEmpty({ message: "Password is required" })
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, { message: "Password must contain at least one letter and one number" })
    password: string;
    
    @Column({ nullable: true })
    @IsOptional()
    @IsString({ message: "Profile picture must be a string URL" })
    profilePicture?: string;

    @Column()
    @IsNotEmpty({ message: "Role is required" })
    @IsString({ message: "Role must be a string" })
    role: string;

    @OneToMany(() => Feedback, (feedback) => feedback.user, { cascade: true })
    feedbacks: Feedback[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => AddToCart, (cart) => cart.user, { cascade: true })
    cart: AddToCart[];

    @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}


@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty({ message: "Street is required" })
  street: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: "City is required" })
  city: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: "State is required" })
  state: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: "Country is required" })
  country: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: "Pincode is required" })
  pincode: string;

  @Column({ default: false })
  @IsBoolean()
  isDefault: boolean;

  @ManyToOne(() => userAuth, (user) => user.addresses, { onDelete: "CASCADE" })
  user: userAuth;
}

//product table

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: "Product name is required" })
    @IsString({ message: "Product name must be a string" })
    productName: string;

    @Column()
    @IsNotEmpty({ message: "Old price is required" })
    @IsNumber({}, { message: "Old price must be a number" })
    @Min(0, { message: "Old price must be at least 0" })
    product_Old_Price: number;

    @Column()
    @IsNotEmpty({ message: "New price is required" })
    @IsNumber({}, { message: "New price must be a number" })
    @Min(0, { message: "New price must be at least 0" })
    product_New_Price: number;

    @Column({ type: 'int', default: 0 })
    quantity: number;
    

    @Column()
    @IsNotEmpty({ message: "Category is required" })
    @IsString({ message: "Category must be a string" })
    category: string;


    @Column({ nullable: true })
    @IsString({ message: "Image URL must be a string" })
    imageUrl?: string;

    @OneToMany(() => Order, (order) => order.products)
    orders: Order[];

    
    @OneToMany(() => Feedback, (feedback) => feedback.product)
    feedbacks: Feedback[];

    @OneToMany(() => Offer, (offer) => offer.product)
    offers: Offer[];

    @OneToMany(() => AddToCart, (cart) => cart.product, { cascade: true }) // Fixed relation
    cart: AddToCart[];
}


// feedback table

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => userAuth, (user) => user.feedbacks)
    @IsNotEmpty({ message: "User is required" })
    user: userAuth;
    
    @ManyToOne(() => Product, (product) => product.feedbacks)
    @IsNotEmpty({ message: "Product is required" })
    product: Product;

    @Column({ type: "text" })
    @IsNotEmpty({ message: "Comment is required" })
    @IsString({ message: "Comment must be a string" })
    comment: string;

    @Column({ type: "int" })
    @IsNotEmpty({ message: "Rating is required" })
    @IsNumber({}, { message: "Rating must be a number" })
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating cannot be more than 5" })
    rating: number;

    @CreateDateColumn()
    createdAt: Date;
}

// offer entities--->

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.offers, { onDelete: "CASCADE" }) 
    @IsNotEmpty({ message: "Product is required" })
    product: Product;

    @Column({ type: "decimal" })
    @IsNotEmpty({ message: "Discount percentage is required" })
    @IsNumber({}, { message: "Discount must be a number" })
    @Min(1, { message: "Discount must be at least 1%" })
    @Max(100, { message: "Discount cannot exceed 100%" })
    discountPercentage: number;

    @Column({ type: "text"})
    @IsString({ message: "Offer description must be a string" })
    description?: string;

    @Column({ type: "timestamp" })
    @IsNotEmpty({ message: "Start date is required" })
    @IsDate({ message: "Start date must be a valid date" })
    startDate: Date;

    @Column({ type: "timestamp" })
    @IsNotEmpty({ message: "End date is required" })
    @IsDate({ message: "End date must be a valid date" })
    endDate: Date;

   
}


//add to cart

@Entity()
export class AddToCart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => userAuth, (user) => user.cart, { onDelete: "CASCADE" })
    @IsNotEmpty({ message: "User is required" })
    user: userAuth;

    @ManyToOne(() => Product, (product) => product.cart, { onDelete: "CASCADE" }) // Fixed relation
    @IsNotEmpty({ message: "At least one product is required" })
    product: Product; 

    @Column({ type: "int", default: 1 })
    @IsNumber({}, { message: "Quantity must be a number" })
    @Min(1, { message: "Quantity must be at least 1" })
    quantity: number;
    
    @Column({ default: "M" })
    @IsIn(["S", "M", "L", "XL", "XXL"], { message: "Size must be one of  S, M, L, XL, XXL" })
    size: string;


    @CreateDateColumn()
    addedAt: Date;
}


@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  razorpay_order_id: string;

  @Column()
  razorpay_payment_id: string;

  @Column()
  razorpay_signature: string;

  @CreateDateColumn()
  createdAt: Date;
}
