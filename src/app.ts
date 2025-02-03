
import express,{Express,request,response} from 'express'
import { router } from './Routers/userRoutes'
import { swaggerUi, swaggerSpec } from './SwaggerApI/Swagger';
import { AppDataSource } from "./DBconnect/Connect";
import "reflect-metadata";
// import "dotenv/config";
import { config } from "dotenv";
config();  // This explicitly loads the .env file
// import "dotenv/config";
const app:Express = express()
app.use(express.json())
const port=3000;

app.use('/api',router)
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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



