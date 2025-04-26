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