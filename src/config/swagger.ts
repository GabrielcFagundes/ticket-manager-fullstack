import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Ticket Manager API',
      version: '1.0.0',
      description: 'API Node.js para gerenciamento de eventos e ingressos.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);