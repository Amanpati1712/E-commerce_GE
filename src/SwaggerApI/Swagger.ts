import swaggerJSDoc from 'swagger-jsdoc' ;
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for the E-commerce website',
    },
    servers: [
      {
        url: 'http://localhost:3000', // API base URL
      },
    ],
  },
  apis: ['./src/SwaggerApi/*.ts'], // Check if your files are actually here
};


// Initialize Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
