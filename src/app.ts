
import express,{Express,request,response} from 'express'
import { router } from './Modules/User/Routers/AuthRoutes'
import path from 'path';
import { AppDataSource } from "./Infra/DBconnect/Connect";
import "reflect-metadata";
// import "dotenv/config";
import cors from "cors";
import { config } from "dotenv";
import { UserRouter } from './Modules/User/Routers/UserRoutes';
import { swaggerSpec, swaggerUi } from './SwaggerApI/Swagger';
import { orderRouter } from './Modules/Order/Routers/orderRoutes';
import Razorpay from 'razorpay'

config();  // This explicitly loads the .env file
// import "dotenv/config";

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

const app:Express = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); 
const port=process.env.PORT || 3000;
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded files
app.use('/api/auth',router)
app.use('/api/user',UserRouter )
//orders------>
app.use('/api',orderRouter);

// DataBase connectivity
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully!");

        // Start Express Server after DB connection
        app.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error connecting to Database:", err);
    });

export default app;

