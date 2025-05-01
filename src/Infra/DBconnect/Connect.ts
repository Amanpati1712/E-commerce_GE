
import { Address, AddToCart, Feedback,Offer, Payment, Product, userAuth } from "../../Modules/User/Entities/User";
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Order } from "../../Modules/Order/Entities/orderEntities";

dotenv.config(); // Load environment variables
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [userAuth,Product,Order,Feedback,Offer,AddToCart,Address,Payment], // Adjust path if needed
  synchronize: true, // Change to false in production
  logging: true,
});


