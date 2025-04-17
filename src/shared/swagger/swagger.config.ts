import { SwaggerDefinition } from 'swagger-jsdoc';

export const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Realtime Chat API',
    version: '1.0.0',
    description: 'Real-time chat API documentation',
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Development server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};