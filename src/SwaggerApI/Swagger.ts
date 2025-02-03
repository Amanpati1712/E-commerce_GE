import swaggerJSDoc from 'swagger-jsdoc' ;
import swaggerUi from 'swagger-ui-express';

// Basic Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'E-Commerce API', // API Title
      version: '1.0.0', // API Version
      description: 'API documentation for the E-commerce website',
    },
    servers: [
      {
        url: 'http://localhost:3000', // API base URL
      },
    ],
  },
  // Path to the API specs
  apis: ['src/route/*.ts'], // Path to your route files (JSDoc comments)
};

// Initialize Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
