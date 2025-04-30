import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swag = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API documentation',
            version: '1.0.0',
            description: 'Documentation de l\'API du projet',
        },
        servers: [{
                url: 'http://localhost:5000',
            },
            {
                url: 'https://d30e6c47-601f-4639-85d1-4f2aa05d5e11-00-17cyw139my6yf.kirk.replit.dev/docs/'
            },
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
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./routes/*.js'],
    };
const swaggerDocs = swaggerJsDoc(swag);

export { swaggerDocs, swaggerUi };