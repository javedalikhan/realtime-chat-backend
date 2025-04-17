import fs from 'fs';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerDefinition } from './swagger.config';

const options = {
  swaggerDefinition,
  apis: [
    './src/api/routes/*.ts',
    './src/modules/**/*.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

if (process.env.NODE_ENV !== 'production') {
  const swaggerPath = path.resolve(__dirname, '../../../public/swagger.json');
  fs.writeFileSync(swaggerPath, JSON.stringify(swaggerSpec, null, 2));
}

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'Chat API Docs',
});